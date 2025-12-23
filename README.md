# Strafhegy: The Encrypted SocialFi Platform



**Strafhegy** is a next-generation **SocialFi** dApp built on the **Zama FHEVM** (Fully Homomorphic Encryption Virtual Machine). It solves the critical problem of transparency vs. privacy in social trading.

Traditionally, sharing on-chain strategies means exposing your wallet and exact moves to everyone. With Strafhegy, Creators can prove their performance and share strategies **encrypted on-chain**. Only paying subscribers can decrypt and view the specific entry/exit points, ensuring "Alpha" remains exclusive.

---

## 🌟 Key Features

*   **🛡️ End-to-End Encryption:** Trading signals (Entry Price, Target, Coin Type) are encrypted using Zama's FHE technology. Nodes validate transactions without ever seeing the raw data.
*   **💳 Subscription-Gated Access:** Smart contracts handle monthly subscription fees securely. Access to decrypt data is granted strictly on-chain via `FHE.allow`.
*   **🚫 No Backdoors:** Even the platform developers cannot see your hidden strategies. Privacy is mathematically guaranteed by the FHE protocol.
*   **💾 Retro User Interface:** A nostalgic Windows 98/XP-style interface that makes interacting with advanced crypto-tech fun and familiar.

---

## 🔄 Chronological User Flow

### 1. Initialization
*   **Connect Wallet:** User connects via MetaMask.
*   **FHEVM Init:** The app initializes the Zama Relayer instances to enable encrypted operations on the Sepolia testnet.

### 2. The Creator Journey (e.g., Alice)
*   **Profile Setup:** Alice sets her "Monthly Fee" (e.g., 0.005 ETH). This registers her as a Creator on the smart contract.
*   **Strategy Creation:** Alice spots an opportunity. She enters:
    *   *Coin:* ETH
    *   *Expectation:* Long
    *   *Entry:* $2500
    *   *Target:* $3000
    *   *Encrypted Fields:* All these specific values.
*   **Encryption:** The app encrypts these values *client-side*, generating secure handles.
*   **On-Chain Submission:** The encrypted "handles" are sent to the Strafhegy smart contract. The network stores them, but they appear as random ciphertext to observers.

### 3. The Subscriber Journey (e.g., Bob)
*   **Discovery:** Bob explores the "Other Creators" list and sees Alice's profile.
*   **Subscription:** Bob pays the 0.005 ETH fee to the contract.
*   **Access Grant:** The contract records Bob's subscription and automatically executes `FHE.allow` to grant Bob's wallet address permission to compute/view Alice's previous and future ciphertexts for the duration of the subscription.
*   **Decryption:** Bob clicks "Start Decryption".
    1.  The app requests an **EIP-712** signature from Bob's wallet (proof of identity).
    2.  This signature is sent to the FHEVM network.
    3.  The network re-encrypts the data specifically for Bob's viewing key.
    4.  Bob's frontend reveals the plaintext: "ETH Long @ $2500".

---

## 📝 Example Scenario: "The Alpha Leak Problem"

**Without Strafhegy:**
Alice finds a gem. She tweets "Buying token X". Bots immediately front-run her, and non-paying users copy the trade without supporting her work. She loses her edge.

**With Strafhegy:**
1.  **Alice** posts an encrypted signal.
2.  **Public** sees: `[Encrypted Position #42]`.
3.  **Bob (Subscriber)** clicks decrypt and sees: `Buy $LINK at $15.00`.
4.  **Charlie (Non-Subscriber)** clicks decrypt and sees: `Access Denied` or random garbage data.

Alice monetizes her knowledge securely. Bob gets exclusive access. The market stays fair.

---

## 🛠 Technical Architecture

### System Overview

```mermaid
graph TD
    User[Subscriber (Bob)]
    Creator[Creator (Alice)]
    Frontend[Vue 3 App (Retro UI)]
    Contract[Strafhegy.sol]
    FHEVM[Zama FHEVM Network]

    subgraph On-Chain
    Contract
    FHEVM
    end

    Creator -->|1. Encrypts Data| Frontend
    Frontend -->|2. addPosition(encryptedHandles)| Contract
    Contract -->|3. Store Ciphertext| FHEVM
    
    User -->|4. Subscribe (Pay ETH)| Contract
    Contract -->|5. FHE.allow(User)| FHEVM
    
    User -->|6. Request Decryption| Frontend
    Frontend -->|7. userDecrypt(signature)| FHEVM
    FHEVM -->|8. Re-encrypted Result| Frontend
    Frontend -->|9. Display Plaintext| User
```

### Tech Stack
*   **Frontend:** Vue 3 (Composition API), Vite, Ethers.js v6.
*   **Styling:** Custom CSS (Windows 98/XP Theme).
*   **FHE SDK:** `@fhevmjs` (Zama Relayer SDK) for client-side encryption/decryption.
*   **Smart Contracts:** Solidity 0.8.24, `@fhevm/solidity`.
*   **Network:** Sepolia Testnet (Zama Devnet).

---

## 🚀 Installation & Setup

### Prerequisites
*   Node.js v18+
*   MetaMask Wallet
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/tg382018/strafhegy.git
cd strafhegy
```

### 2. Backend (Smart Contracts)
```bash
cd strafhegy-backend
npm install

# Compile contracts
npx hardhat compile

# Deploy to Sepolia (configured in hardhat.config.ts)
npm run deploy:sepolia
```

### 3. Frontend (Application)
```bash
cd strafhegy-frontend
npm install

# Run development server
npm run dev
```

Open `http://localhost:5173` (or the port shown) to launch the app.

---

## 📄 License
MIT License. Built with ❤️ for the Zama FHEVM ecosystem.
