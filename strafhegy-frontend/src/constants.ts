export const CONTRACT_ADDRESSES: Record<number, string> = {
    11155111: "0x86F4092A44CeE9490c2955322f3b62B793ff7c79", // Sepolia
    31337: "", // Local
};

export const SEPOLIA_CONFIG = {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://ethereum-sepolia.publicnode.com"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};

export const SOCIAL_ABI = [
    {
        name: "creatorActive",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "", type: "address" }],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        name: "monthlyPriceWei",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "subscriptionExpiry",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "", type: "address" },
            { name: "", type: "address" },
        ],
        outputs: [{ name: "", type: "uint32" }],
    },
    {
        name: "getPositionCount",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "creator", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getPosition",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "creator", type: "address" },
            { name: "positionId", type: "uint256" },
        ],
        outputs: [
            { name: "coinCode", type: "bytes32" },
            { name: "expectation", type: "bytes32" },
            { name: "entryPrice", type: "bytes32" },
            { name: "openedAt", type: "bytes32" },
            { name: "target", type: "bytes32" },
            { name: "status", type: "bytes32" },
            { name: "exists", type: "bool" },
        ],
    },
    {
        name: "usernames",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "", type: "address" }],
        outputs: [{ name: "", type: "string" }],
    },
    { name: "upsertProfile", type: "function", stateMutability: "nonpayable", inputs: [{ name: "priceWei", type: "uint256" }, { name: "active", type: "bool" }, { name: "username", type: "string" }], outputs: [] },
    {
        name: "addPosition",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "coinCodeEnc", type: "bytes32" },
            { name: "expectationEnc", type: "bytes32" },
            { name: "entryPriceEnc", type: "bytes32" },
            { name: "openedAtEnc", type: "bytes32" },
            { name: "targetEnc", type: "bytes32" },
            { name: "statusEnc", type: "bytes32" },
            { name: "deadline", type: "uint256" },
            { name: "inputProof", type: "bytes" },
        ],
        outputs: [],
    },
    { name: "subscribe", type: "function", stateMutability: "payable", inputs: [{ name: "creator", type: "address" }], outputs: [] },
    { name: "refreshAccess", type: "function", stateMutability: "nonpayable", inputs: [{ name: "creator", type: "address" }], outputs: [] },
    { name: "grantAccess", type: "function", stateMutability: "nonpayable", inputs: [{ name: "creator", type: "address" }, { name: "positionIds", type: "uint256[]" }], outputs: [] },
    {
        name: "updatePositionStatus",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "positionId", type: "uint256" },
            { name: "statusEnc", type: "bytes32" },
            { name: "deadline", type: "uint256" },
            { name: "inputProof", type: "bytes" },
        ],
        outputs: [],
    },
    { name: "getCreatorCount", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
    { name: "getCreatorAt", type: "function", stateMutability: "view", inputs: [{ name: "index", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
    { name: "getAllCreators", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address[]" }] },
    { name: "getActiveSubscriberCount", type: "function", stateMutability: "view", inputs: [{ name: "creator", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
];
