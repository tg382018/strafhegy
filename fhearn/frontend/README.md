# FHEarn Frontend

Confidential DeFi platform with onchain score-based custom APY.

## Features

- **Multi-Chain Analytics**: Real-time wallet metrics from 7 blockchains
- **Onchain Scoring**: Advanced algorithm based on transaction activity, wallet age, multi-chain usage
- **Custom APY**: Score-based APY tiers (5%-25%)
- **FHEVM Integration**: Confidential computations on Sepolia testnet
- **Modern UI**: Gradient design with glassmorphism effects

## Tech Stack

- **Vue 3 + TypeScript**: Modern frontend framework
- **Ethers v6**: Ethereum wallet integration
- **Zama Relayer SDK**: FHEVM confidential operations
- **Covalent API**: Multi-chain wallet analytics
- **Tailwind CSS**: Styling and responsive design

## Quick Start

### Prerequisites
- Node 18+ (or 20+ recommended)
- MetaMask (desktop)
- Sepolia ETH

### Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run preview
```

## Configuration

### Network Settings (`Network.json`)
```json
{
   "public": {
        "CHAIN_NAME": "Sepolia",
        "CURRENCY_NAME": "ETH", 
        "CURRENCY_SYMBOL": "ETH",
        "RPC_URL": "https://eth-sepolia.public.blastapi.io",
        "EXPLORER_URL": "https://sepolia.etherscan.io",
        "CHAIN_ID": 11155111
   }
}
```

### Contract Addresses (`FHEarn.json`)
```json
{
    "FHEARN_CORE_ADDRESS": "0x...",
    "FACTORY_ADDRESS": "0x...",
    "BACKEND_GITHUB_URL": "https://github.com/tg382018/FHEarn-Onchain-Score-Based-Custom-APY"
}
```

## Features Overview

### 1. **Wallet Analytics**
- Multi-chain wallet metrics (Ethereum, Polygon, BSC, Avalanche, Fantom, Arbitrum, Optimism)
- Real-time balance, transaction count, wallet age
- Token diversity and activity analysis

### 2. **Onchain Scoring**
Advanced algorithm with 6 components:
- Transaction Activity (0-30 points)
- Wallet Age (0-20 points)
- Multi-chain Usage (0-25 points)
- Token Diversity (0-15 points)
- Active Tokens (0-10 points)
- Balance Score (0-20 points)
- Bonus multipliers for veterans and high activity

### 3. **Custom APY System**
Score-based APY tiers:
- **Elite** (120-150): 25% APY
- **Advanced** (90-119): 20% APY
- **Experienced** (70-89): 15% APY
- **Intermediate** (50-69): 12% APY
- **Beginner** (30-49): 8% APY
- **Newcomer** (0-29): 5% APY

### 4. **FHEVM Integration**
- Confidential smart contract interactions
- Real mode verification
- Encrypted computations
- Sepolia testnet deployment

## Local Storage

- `FHEARN_WALLET_METRICS` - Cached wallet analytics data
- `FHEARN_SCORE_HISTORY` - Historical score calculations

## License

BSD 3-Clause Clear License