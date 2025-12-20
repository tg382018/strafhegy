# FHEarn Backend

Confidential DeFi platform powered by Fully Homomorphic Encryption (FHEVM).

## Features

- **FHEVM Integration**: Confidential smart contracts on Sepolia testnet
- **Onchain Scoring**: Multi-chain wallet analytics and scoring algorithm
- **Custom APY**: Score-based APY tiers (5%-25%)
- **Stake System**: Confidential staking with FHEVM

## Tech Stack

- **Hardhat**: Ethereum development environment
- **FHEVM**: Fully Homomorphic Encryption Virtual Machine
- **Solidity**: Smart contract development
- **TypeScript**: Backend development

## Quick Start

```bash
npm install
npx hardhat compile
npx hardhat deploy --network sepolia
```

## Contracts

- `FHEarnCore.sol`: Main confidential computation contract
- `ERC7984.sol`: Confidential token standard

## Networks

- **Sepolia**: Testnet deployment
- **Hardhat**: Local development

## Onchain Scoring Algorithm

Multi-chain wallet analysis with Covalent API:
- Transaction activity (0-30 points)
- Wallet age (0-20 points) 
- Multi-chain usage (0-25 points)
- Token diversity (0-15 points)
- Active tokens (0-10 points)
- Balance score (0-20 points)
- Bonus multipliers for veterans and high activity

## APY Tiers

| Score | Tier | APY |
|-------|------|-----|
| 120-150 | Elite | 25% |
| 90-119 | Advanced | 20% |
| 70-89 | Experienced | 15% |
| 50-69 | Intermediate | 12% |
| 30-49 | Beginner | 8% |
| 0-29 | Newcomer | 5% |

## License

BSD 3-Clause Clear License