// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title StrafhegySocial_uint32
 * @notice Subscription-gated strategy board.
 *
 * All position fields are encrypted (euint32). Frontend displays "***" until subscription is active.
 *
 * Field encoding (suggested):
 * - coinCode: uint32 (offchain mapping, e.g., 1=ETH, 2=BTC, ...)
 * - expectation: 0=down, 1=up
 * - entryPrice: uint32 (choose a scaling offchain, e.g., price * 100)
 * - openedAt: unix seconds (fits in uint32 for current era)
 * - target: uint32 (same scaling as entryPrice)
 * - status: 0=ongoing, 1=closed
 */
contract StrafhegySocial_uint32 is ZamaEthereumConfig {
    struct Position {
        euint32 coinCode;
        euint32 expectation;
        euint32 entryPrice;
        euint32 openedAt;
        euint32 target;
        euint32 status;
        bool exists;
    }

    mapping(address => uint256) public monthlyPriceWei; // creator => monthly fee (wei)
    mapping(address => bool) public creatorActive; // creator => active profile
    mapping(address => Position[]) private _positions; // creator => positions

    // creator => subscriber => expiry timestamp
    mapping(address => mapping(address => uint32)) public subscriptionExpiry;

    // Track all creators who have created at least 1 position
    address[] private _allCreators;
    mapping(address => bool) private _isCreator;

    event ProfileUpserted(address indexed creator, uint256 monthlyPriceWei, bool active);
    event PositionAdded(address indexed creator, uint256 indexed positionId);
    event PositionStatusUpdated(address indexed creator, uint256 indexed positionId);
    event Subscribed(address indexed subscriber, address indexed creator, uint32 expiresAt, uint256 paidWei);

    modifier onlyCreatorProfile(address creator) {
        require(creatorActive[creator], "CreatorNotActive");
        _;
    }

    modifier onlyActiveSubscription(address creator, address subscriber) {
        require(subscriptionExpiry[creator][subscriber] > uint32(block.timestamp), "SubscriptionInactive");
        _;
    }

    // ============
    // Creator
    // ============

    function upsertProfile(uint256 priceWei, bool active) external {
        monthlyPriceWei[msg.sender] = priceWei;
        creatorActive[msg.sender] = active;
        emit ProfileUpserted(msg.sender, priceWei, active);
    }

    function addPosition(
        externalEuint32 coinCodeEnc,
        externalEuint32 expectationEnc,
        externalEuint32 entryPriceEnc,
        externalEuint32 openedAtEnc,
        externalEuint32 targetEnc,
        externalEuint32 statusEnc,
        uint256 deadline,
        bytes calldata inputProof
    ) external onlyCreatorProfile(msg.sender) {
        require(block.timestamp < deadline, "Expired");

        Position memory p;
        p.coinCode = FHE.fromExternal(coinCodeEnc, inputProof);
        p.expectation = FHE.fromExternal(expectationEnc, inputProof);
        p.entryPrice = FHE.fromExternal(entryPriceEnc, inputProof);
        p.openedAt = FHE.fromExternal(openedAtEnc, inputProof);
        p.target = FHE.fromExternal(targetEnc, inputProof);
        p.status = FHE.fromExternal(statusEnc, inputProof);
        p.exists = true;

        // CRITICAL: Contract must have permission for user decryption to work!
        FHE.allowThis(p.coinCode);
        FHE.allowThis(p.expectation);
        FHE.allowThis(p.entryPrice);
        FHE.allowThis(p.openedAt);
        FHE.allowThis(p.target);
        FHE.allowThis(p.status);

        // Creator can always decrypt their own fields
        FHE.allow(p.coinCode, msg.sender);
        FHE.allow(p.expectation, msg.sender);
        FHE.allow(p.entryPrice, msg.sender);
        FHE.allow(p.openedAt, msg.sender);
        FHE.allow(p.target, msg.sender);
        FHE.allow(p.status, msg.sender);

        _positions[msg.sender].push(p);

        // Track creator in the list (first position triggers this)
        if (!_isCreator[msg.sender]) {
            _isCreator[msg.sender] = true;
            _allCreators.push(msg.sender);
        }

        emit PositionAdded(msg.sender, _positions[msg.sender].length - 1);
    }

    function updatePositionStatus(
        uint256 positionId,
        externalEuint32 statusEnc,
        uint256 deadline,
        bytes calldata inputProof
    ) external onlyCreatorProfile(msg.sender) {
        require(block.timestamp < deadline, "Expired");
        require(positionId < _positions[msg.sender].length, "BadPositionId");
        require(_positions[msg.sender][positionId].exists, "NoPosition");

        euint32 st = FHE.fromExternal(statusEnc, inputProof);
        _positions[msg.sender][positionId].status = st;
        FHE.allow(st, msg.sender);

        emit PositionStatusUpdated(msg.sender, positionId);
    }

    // ============
    // Subscriber
    // ============

    function subscribe(address creator) external payable {
        require(creatorActive[creator], "CreatorNotActive");
        uint256 price = monthlyPriceWei[creator];
        require(price > 0, "PriceNotSet");
        require(msg.value >= price, "InsufficientPayment");

        // extend subscription (stackable)
        uint32 currentExpiry = subscriptionExpiry[creator][msg.sender];
        uint32 base = currentExpiry > uint32(block.timestamp) ? currentExpiry : uint32(block.timestamp);
        uint32 newExpiry = base + uint32(30 days);
        subscriptionExpiry[creator][msg.sender] = newExpiry;

        // pay creator immediately (simple MVP path)
        if (creator != msg.sender) {
            (bool ok, ) = payable(creator).call{value: msg.value}("");
            require(ok, "PaymentFailed");
        } else {
            // Refund if subscribing to self (testing purpose)
            (bool ok, ) = payable(msg.sender).call{value: msg.value}("");
            require(ok, "RefundFailed");
        }

        // _grantAllPositions(creator, msg.sender);
        // Note: Permissions are NOT auto-granted to save gas.
        // User must call grantAccess() or refreshAccess() separately if needed.
        emit Subscribed(msg.sender, creator, newExpiry, msg.value);
    }

    function refreshAccess(address creator)
        external
        onlyCreatorProfile(creator)
        onlyActiveSubscription(creator, msg.sender)
    {
        _grantAllPositions(creator, msg.sender);
    }

    function grantAccess(address creator, uint256[] calldata positionIds)
        external
        onlyCreatorProfile(creator)
        onlyActiveSubscription(creator, msg.sender)
    {
        
        
        
        Position[] storage arr = _positions[creator];
        
        
        for (uint256 i = 0; i < positionIds.length; i++) {
            uint256 pid = positionIds[i];
            
            
            if (pid >= arr.length || !arr[pid].exists) {
                
                continue;
            }
            
            
            FHE.allow(arr[pid].coinCode, msg.sender);
            FHE.allow(arr[pid].expectation, msg.sender);
            FHE.allow(arr[pid].entryPrice, msg.sender);
            FHE.allow(arr[pid].openedAt, msg.sender);
            FHE.allow(arr[pid].target, msg.sender);
            FHE.allow(arr[pid].status, msg.sender);
            
        }
        
    }

    function _grantAllPositions(address creator, address subscriber) internal {
        Position[] storage arr = _positions[creator];
        // Optimization: Only grant access to the last 5 positions
        uint256 start = 0;
        if (arr.length > 5) {
            start = arr.length - 5;
        }
        for (uint256 i = start; i < arr.length; i++) {
            if (!arr[i].exists) continue;
            FHE.allow(arr[i].coinCode, subscriber);
            FHE.allow(arr[i].expectation, subscriber);
            FHE.allow(arr[i].entryPrice, subscriber);
            FHE.allow(arr[i].openedAt, subscriber);
            FHE.allow(arr[i].target, subscriber);
            FHE.allow(arr[i].status, subscriber);
        }
    }

    // ============
    // Views
    // ============

    function getPositionCount(address creator) external view returns (uint256) {
        return _positions[creator].length;
    }

    function getPosition(address creator, uint256 positionId)
        external
        view
        returns (
            euint32 coinCode,
            euint32 expectation,
            euint32 entryPrice,
            euint32 openedAt,
            euint32 target,
            euint32 status,
            bool exists
        )
    {
        require(positionId < _positions[creator].length, "BadPositionId");
        Position storage p = _positions[creator][positionId];
        return (p.coinCode, p.expectation, p.entryPrice, p.openedAt, p.target, p.status, p.exists);
    }

    /// @notice Returns the total number of creators who have at least 1 position
    function getCreatorCount() external view returns (uint256) {
        return _allCreators.length;
    }

    /// @notice Returns creator address at index
    function getCreatorAt(uint256 index) external view returns (address) {
        require(index < _allCreators.length, "IndexOutOfBounds");
        return _allCreators[index];
    }

    /// @notice Returns all creator addresses (use with caution for large arrays)
    function getAllCreators() external view returns (address[] memory) {
        return _allCreators;
    }
}


