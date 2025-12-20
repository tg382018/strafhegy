// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHEarnCore
 * @dev Core contract for FHEarn - Confidential DeFi Platform
 * This is a simplified version focusing on FHEVM integration
 */
contract FHEarnCore is SepoliaConfig {
    
    // Events
    event ConfidentialDataStored(bytes32 indexed dataHash, euint64 encryptedValue);
    event ComputationPerformed(bytes32 indexed operationId, euint64 result);
    
    // Storage for confidential data
    mapping(bytes32 => euint64) private confidentialData;
    
    /**
     * @dev Store confidential data
     * @param dataHash Hash identifier for the data
     * @param encryptedValue Encrypted value to store
     */
    function storeConfidentialData(bytes32 dataHash, euint64 encryptedValue) external {
        confidentialData[dataHash] = encryptedValue;
        emit ConfidentialDataStored(dataHash, encryptedValue);
    }
    
    /**
     * @dev Perform confidential computation
     * @param a First encrypted value
     * @param b Second encrypted value
     * @return result Encrypted result of computation
     */
    function confidentialAdd(euint64 a, euint64 b) external returns (euint64 result) {
        result = FHE.add(a, b);
    }
    
    /**
     * @dev Perform confidential multiplication
     * @param a First encrypted value
     * @param b Second encrypted value
     * @return result Encrypted result of multiplication
     */
    function confidentialMultiply(euint64 a, euint64 b) external returns (euint64 result) {
        result = FHE.mul(a, b);
    }
    
    /**
     * @dev Check if encrypted value is greater than another
     * @param a First encrypted value
     * @param b Second encrypted value
     * @return isGreater Encrypted boolean result
     */
    function confidentialGreaterThan(euint64 a, euint64 b) external returns (ebool isGreater) {
        isGreater = FHE.gt(a, b);
    }
    
    /**
     * @dev Get stored confidential data
     * @param dataHash Hash identifier for the data
     * @return encryptedValue Encrypted value stored
     */
    function getConfidentialData(bytes32 dataHash) external view returns (euint64 encryptedValue) {
        encryptedValue = confidentialData[dataHash];
    }
    
    /**
     * @dev Allow decryption of a value (for testing purposes)
     * @param encryptedValue The encrypted value to allow for decryption
     */
    function allowDecryption(euint64 encryptedValue) external {
        FHE.allowThis(encryptedValue);
    }
}