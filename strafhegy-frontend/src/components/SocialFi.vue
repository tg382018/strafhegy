<template>
  <div class="page">
    <div class="background-mesh"></div>

    <header>
      <div class="logo">
        <div class="straf-logo-component">
          <div class="straf-icon-box">
            <div class="straf-dots"></div>
            <div class="straf-hex-outer"></div>
            <div class="straf-hex-inner"></div>
          </div>
          <div class="straf-text-box">
            <span class="straf-title">strafhegy</span>
            <span class="straf-subtitle">FHEVM</span>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <button class="win-btn how-to-use-btn" @click="showHelp = true">How to Use</button>
        <button class="connect-btn" :class="{ connected: isConnected }" @click="onToggleWallet">
          {{ connectLabel }}
        </button>
      </div>
    </header>

    <div class="container">
      <!-- Creator panel (for testing / demo) -->
      <div class="user-card creator-panel" :class="{ 'minimized-anim': myPanelMinimized }">
        <div class="card-header">
          <span>Creator.exe</span>
          <div class="window-controls">
            <button class="win-btn" @click="myPanelMinimized = true">_</button>
            <button class="win-btn" disabled>□</button>
            <button class="win-btn close-btn" disabled>×</button>
          </div>
        </div>
        <div class="profile-section">
          <div class="avatar" :style="{ backgroundColor: getAvatarColor(account) }">
            <span class="avatar-initials">{{ getInitials(account) }}</span>
          </div>
          <div class="wallet-address">
            {{ isConnected ? account : "Connect wallet (creator panel)" }}
          </div>
        </div>
        <div class="positions-list">
          <div class="pos-item">
            <div class="pos-header">
              <span>Profile</span>
              <span>{{ contractAddress ? "Contract OK" : "Contract required" }}</span>
            </div>
            <template v-if="isEditingProfile || !myProfileReady">
              <div class="pos-details">
                <span>Monthly fee (ETH)</span>
                <input v-model="creatorPriceEth" class="input" placeholder="0.005" />
              </div>
              <button class="sub-btn" :disabled="!canWrite || isBusy" @click="upsertProfile">
                {{ isBusy ? "Processing..." : "Save Profile" }}
              </button>
            </template>
            <template v-else>
              <div class="pos-details">
                <span>Set monthly fee</span>
                <span class="value">{{ formatEth(myMonthlyPriceWei) }} ETH</span>
              </div>
              <div class="pos-details">
                <span>Days left</span>
                <span class="value">{{ myRemainingDaysLabel }}</span>
              </div>
              <button class="sub-btn secondary" :disabled="isBusy" @click="startEditProfile">Change monthly fee</button>
            </template>
          </div>

          <div v-if="myProfileReady && !isEditingProfile" class="pos-item">
            <div class="pos-header">
              <span>Add Position</span>
              <span>Encrypted</span>
            </div>
            <div class="fields-stack">
              <label class="field">
                <span>Coin</span>
                <input v-model="newPos.coinName" class="input" type="text" placeholder="ETH, BTC, SOL..." />
              </label>
              <label class="field">
                <span>Expectation</span>
                <select v-model.number="newPos.expectation" class="input">
                  <option :value="1">Long</option>
                  <option :value="0">Short</option>
                </select>
              </label>
              <label class="field">
                <span>Entry price (x100)</span>
                <input v-model.number="newPos.entryPrice" class="input" type="number" placeholder="10000" />
              </label>
              <label class="field">
                <span>Target price (x100)</span>
                <input v-model.number="newPos.target" class="input" type="number" placeholder="12000" />
              </label>
            </div>
            <button class="sub-btn" :disabled="!canWrite || isBusy" @click="addPosition">
              {{ isBusy ? "Processing..." : "Add Position" }}
            </button>
            <div class="sub-info">
              Status is automatically set to "In progress" when a position is created.
            </div>
          </div>

          <div v-else class="pos-item">
            <div class="pos-header">
              <span>Add Position</span>
              <span>Locked</span>
            </div>
            <div class="sub-info">Create your profile (save monthly fee) first to add positions.</div>
          </div>
        </div>
      </div>

      <!-- Creator cards -->
      <div v-for="creator in creators" :key="creator.address" class="user-card" :class="{ 'minimized-anim': creator.isMinimized }">
        <div class="card-header">
          <span>User.exe</span>
          <div class="window-controls">
            <button class="win-btn" @click="creator.isMinimized = true">_</button>
            <button class="win-btn" disabled>□</button>
            <button class="win-btn close-btn" disabled>×</button>
          </div>
        </div>

        <div class="profile-section">
          <div class="avatar" :style="{ backgroundColor: getAvatarColor(creator.address) }">
            <span class="avatar-initials">{{ getInitials(creator.address) }}</span>
          </div>
          <div class="wallet-address">{{ maskAddress(creator.address) }}</div>
        </div>

        <div class="positions-list">
          <!-- Locked overlay (only for non-subscribers AND not own card) -->
          <div v-if="!creator.subscribed && !creator.isOwnCard" class="locked-overlay">
            <div class="lock-icon">🔒</div>
            <button class="sub-btn" :disabled="!canWrite || creator.isBusy" @click="subscribe(creator)">
              {{ creator.isBusy ? "Processing..." : "Subscribe" }}
            </button>
            <div class="sub-info">
              {{ canWrite ? `1 month access (${formatEth(creator.monthlyPriceWei)} ETH)` : "Connect wallet to view portfolio" }}
            </div>
          </div>

          <div
            v-for="pos in creator.positions"
            :key="pos.positionId"
            class="pos-item"
            :style="(creator.subscribed || creator.isOwnCard) ? {} : { filter: 'blur(4px)', userSelect: 'none' }"
          >
            <div class="pos-header">
              <span>{{ (creator.subscribed || creator.isOwnCard) ? pos.coin : "***" }}</span>
              <span>{{ (creator.subscribed || creator.isOwnCard) ? pos.statusLabel : "***" }}</span>
            </div>
            <div class="pos-details">
            <div class="pos-details">
              <span>Expectation: {{ (creator.subscribed || creator.isOwnCard) ? pos.expectationLabel : "***" }}</span>
              <span>Target: {{ (creator.subscribed || creator.isOwnCard) ? pos.target : "***" }}</span>
            </div>
            <div class="pos-details">
              <span>Entry: {{ (creator.subscribed || creator.isOwnCard) ? pos.entry : "***" }}</span>
              <span>{{ (creator.subscribed || creator.isOwnCard) ? pos.openedAt : "***" }}</span>
            </div>
            </div>
          </div>

          <!-- Action buttons for subscribed/own cards -->
          <div v-if="creator.subscribed || creator.isOwnCard" class="mt-4 flex flex-col gap-2">
            <!-- Decrypt Yourself button (own card with encrypted data) -->
            <button
              v-if="creator.isOwnCard && creator.positions.some(p => p.coin === '***')"
              class="sub-btn"
              style="background: #2563eb !important;"
              :disabled="!canWrite || creator.isBusy"
              @click="refreshAndDecrypt(creator)"
            >
              {{ creator.isBusy ? "Processing..." : "Decrypt Yourself" }}
            </button>

            <!-- Start Decryption button (subscribed creator with encrypted data) -->
            <button
              v-else-if="!creator.isOwnCard && creator.positions.some(p => p.coin === '***')"
              class="sub-btn"
              style="background: #9333ea !important;"
              :disabled="!canWrite || creator.isBusy"
              @click="refreshAndDecrypt(creator)"
            >
              {{ creator.isBusy ? "Processing..." : "Start Decryption" }}
            </button>

            <!-- Refresh button (always available for subscribed/own cards) -->
            <button
              class="sub-btn secondary"
              :disabled="!canWrite || creator.isBusy"
              @click="refreshAndDecrypt(creator)"
            >
              {{ creator.isBusy ? "Processing..." : "Refresh (open new positions)" }}
            </button>
          </div>

          <div v-if="(creator.subscribed || creator.isOwnCard) && creator.expiresAt" class="sub-info">
            Days left: {{ remainingDaysFromExpiry(creator.expiresAt) }}
          </div>
          <div v-if="creator.isOwnCard && !creator.subscribed" class="sub-info own-card-label">
            This is your card - you can see your positions
          </div>
        </div>
      </div>
    </div>

    <!-- Windows 98 Taskbar -->
    <div class="taskbar">
      <a href="mailto:tgulck@gmail.com" class="start-btn contact-link">
        <img src="/strafhegylogo.png" class="start-icon" />
        <span>Contact</span>
      </a>
      
      <div class="taskbar-divider"></div>
      
      <div class="taskbar-items">
        <button v-if="myPanelMinimized" class="taskbar-item" @click="myPanelMinimized = false">
          Creator.exe
        </button>
        <button 
          v-for="c in creators.filter(cr => cr.isMinimized)" 
          :key="c.address" 
          class="taskbar-item" 
          @click="c.isMinimized = false"
        >
          User ({{ maskAddress(c.address, 3) }})
        </button>
      </div>
      
      <div class="taskbar-clock">
        {{ currentTime }}
      </div>
    </div>

    <!-- Notepad Help Window -->
    <div v-if="showHelp" class="notepad-window">
      <div class="card-header">
        <span>HowToUse.txt - Notepad</span>
        <div class="window-controls">
          <button class="win-btn" @click="showHelp = false">×</button>
        </div>
      </div>
      <div class="notepad-content">
        <p>Welcome to Strafhegy SocialFi!</p>
        <p>1. Connect your wallet using the button in the top right.</p>
        <p>2. If you are a creator, set your monthly fee and save your profile.</p>
        <p>3. Add your trading positions (they will be encrypted on-chain!).</p>
        <p>4. Users can subscribe to your profile to decrypt and see your positions.</p>
        <p>5. Use the taskbar to manage your open windows.</p>
        <p>--------------------------------------------------</p>
        <p>For support: tgulck@gmail.com</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ethers } from "ethers";
import { useWalletVue, useFhevmVue, getFheInstance, batchDecryptValues } from "../fhevm";

// =========
// Config
// =========

// Fill this after deploy. We'll also add local hardhat address later.
const CONTRACT_ADDRESSES: Record<number, string> = {
  11155111: "0x5F2328c6a961d845f5c55Dd098A71CbD954f9A63", // Sepolia (updated with getAllCreators)
  31337: "", // Local
};

// Sepolia config for switching
const SEPOLIA_CONFIG = {
  chainId: "0xaa36a7",
  chainName: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://ethereum-sepolia.publicnode.com"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};

const SOCIAL_ABI = [
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
  { name: "upsertProfile", type: "function", stateMutability: "nonpayable", inputs: [{ name: "priceWei", type: "uint256" }, { name: "active", type: "bool" }], outputs: [] },
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
  { name: "getCreatorCount", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "getCreatorAt", type: "function", stateMutability: "view", inputs: [{ name: "index", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { name: "getAllCreators", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address[]" }] },
];

// =========
// Wallet + FHEVM
// =========

const { address: account, chainId, isConnected, connect, disconnect } = useWalletVue();
const { status: fhevmStatus, initialize: initFhevm } = useFhevmVue();

const contractAddress = computed(() => {
  const id = chainId.value;
  return CONTRACT_ADDRESSES[id] || "";
});

const connectLabel = computed(() => {
  if (!isConnected.value) return "Connect Wallet";
  return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`;
});

const canWrite = computed(() => {
  return isConnected.value && fhevmStatus.value === "ready" && !!contractAddress.value;
});

const isBusy = ref(false);

// =========
// Data model
// =========

type PositionView = {
  positionId: number;
  coin: string;
  expectationLabel: string;
  entry: string;
  openedAt: string;
  target: string;
  statusLabel: string;
};

type CreatorCard = {
  address: string;
  avatar: string;
  monthlyPriceWei: bigint;
  subscribed: boolean;
  isOwnCard: boolean; // true if this is the connected user's own card
  expiresAt?: number;
  isBusy?: boolean;
  isMinimized?: boolean;
  positions: PositionView[];
};

const creators = reactive<CreatorCard[]>([]);

// Creator panel form
const creatorPriceEth = ref("0.005");
const myProfileReady = ref(false);
const isEditingProfile = ref(true);
const myMonthlyPriceWei = ref<bigint>(0n);
const mySubscriptionExpiry = ref<number>(0);
const myPanelMinimized = ref(false);
const showHelp = ref(false);

const currentTime = ref("");
setInterval(() => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 1000);

const myRemainingDaysLabel = computed(() => {
  // UX: kullanıcı "profil oluşturunca" burada 1 aylık modelini görmek istiyor.
  // Eğer self-subscription varsa onu göster, yoksa 30 gün sabit göster.
  const exp = mySubscriptionExpiry.value;
  if (exp && exp > Math.floor(Date.now() / 1000)) return String(remainingDaysFromExpiry(exp));
  return myProfileReady.value ? "30" : "-";
});

const newPos = reactive({
  coinName: "ETH",
  expectation: 1,
  entryPrice: 10000, // x100
  target: 12000, // x100
});

// =========
// Helpers
// =========

function maskAddress(addr: string, last = 4) {
  if (!addr) return "";
  return `0x***${addr.slice(-last)}`;
}

function getAvatarColor(address: string): string {
  if (!address) return '#6366f1';
  
  // Hash the address to get a consistent number
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate vibrant colors using HSL
  const hue = Math.abs(hash % 360);
  const saturation = 70; // 70%
  const lightness = 60; // 60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getInitials(address: string): string {
  if (!address) return '?';
  // Use last 3 characters
  return address.slice(-3).toUpperCase();
}

function formatEth(wei: bigint) {
  try {
    return Number(ethers.formatEther(wei)).toFixed(3);
  } catch {
    return "0.000";
  }
}

function coinFromCode(code: number) {
  const map: Record<number, string> = { 1: "ETH", 2: "BTC", 3: "SOL", 4: "AVAX", 5: "LINK", 6: "UNI" };
  if (map[code]) return map[code];
  
  // If code > 100, try to decode as 4-char ASCII
  if (code > 100) {
    let name = "";
    for (let i = 3; i >= 0; i--) {
      const charCode = (code >> (i * 8)) & 0xFF;
      if (charCode > 0) name += String.fromCharCode(charCode);
    }
    return name || `COIN#${code}`;
  }
  
  return `COIN#${code}`;
}

function coinToCode(name: string): number {
  const map: Record<string, number> = { ETH: 1, BTC: 2, SOL: 3, AVAX: 4, LINK: 5, UNI: 6 };
  const upper = name.trim().toUpperCase();
  if (map[upper]) return map[upper];
  
  // Encode up to 4 chars as ASCII into uint32
  let code = 0;
  const str = upper.slice(0, 4);
  for (let i = 0; i < str.length; i++) {
    code = (code << 8) | str.charCodeAt(i);
  }
  return code || 99;
}

function expectationLabel(v: number) {
  return v === 1 ? "Long" : "Short";
}

function statusLabel(v: number) {
  return v === 1 ? "Closed" : "In progress";
}

function fmtDate(sec: number) {
  try {
    return new Date(sec * 1000).toLocaleString();
  } catch {
    return "";
  }
}

function remainingDaysFromExpiry(expirySec: number) {
  const now = Math.floor(Date.now() / 1000);
  const left = Math.max(0, expirySec - now);
  return Math.ceil(left / (24 * 60 * 60));
}

function cacheKey(creator: string) {
  const viewer = account.value ? account.value.toLowerCase() : "guest";
  return `strafhegy_cache_${chainId.value}_${viewer}_${creator.toLowerCase()}`;
}

function cacheRead(creator: string) {
  const raw = localStorage.getItem(cacheKey(creator));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cacheWrite(creator: string, payload: any) {
  localStorage.setItem(cacheKey(creator), JSON.stringify(payload));
}

function cacheClear(creator: string) {
  localStorage.removeItem(cacheKey(creator));
}

async function switchToSepolia() {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA_CONFIG.chainId }] });
  } catch (err: any) {
    if (err?.code === 4902) {
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [SEPOLIA_CONFIG] });
    }
  }
}

async function getReadContract() {
  if (!window.ethereum) throw new Error("No provider");
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(contractAddress.value, SOCIAL_ABI, provider);
}

async function getWriteContract() {
  if (!window.ethereum) throw new Error("No provider");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress.value, SOCIAL_ABI, signer);
}

async function encryptMany32(contractAddr: string, userAddr: string, values: number[]) {
  const fhe = getFheInstance();
  if (!fhe) throw new Error("FHE not initialized");
  const input = fhe.createEncryptedInput(contractAddr, userAddr);
  for (const v of values) input.add32(v);
  const res = await input.encrypt();
  if (!res?.handles || !res?.inputProof) throw new Error("Encrypt result missing handles/proof");
  return { handles: res.handles as string[], inputProof: res.inputProof as string };
}

// =========
// Core flows
// =========

async function onToggleWallet() {
  if (!isConnected.value) {
    console.log("Connecting wallet...");
    console.log("Connecting wallet...");
    await connect();
    if (chainId.value !== 11155111) await switchToSepolia();
    if (isConnected.value && fhevmStatus.value === "idle") {
      console.log("Initializing FHEVM...");
      await initFhevm();
      console.log("FHEVM initialized, status:", fhevmStatus.value);
    }
    await ensureCreators();
    await hydrateAllCreators();
  } else {
    console.log("Disconnecting wallet...");
    disconnect();
    creators.splice(0, creators.length);
  }
}

async function ensureCreators() {
  if (!isConnected.value || !contractAddress.value) return;
  const me = account.value.toLowerCase();

  try {
    const read = await getReadContract();
    
    // Fetch all creators from contract
    const allCreatorAddresses: string[] = await read.getAllCreators();
    
    for (const addr of allCreatorAddresses) {
      const addrLower = addr.toLowerCase();
      if (!creators.find((c) => c.address.toLowerCase() === addrLower)) {
        creators.push({
          address: addr,
          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${addr}`,
          monthlyPriceWei: ethers.parseEther("0.005"),
          subscribed: false,
          isOwnCard: addrLower === me,
          positions: [],
        });
      }
    }
  } catch (e) {
    console.log("Could not fetch creators from contract:", e);
  }

  // Always ensure current user's card is in the list (even if no positions yet)
  if (!creators.find((c) => c.address.toLowerCase() === me)) {
    creators.unshift({
      address: account.value,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${account.value}`,
      monthlyPriceWei: ethers.parseEther("0.005"),
      subscribed: false,
      isOwnCard: true,
      positions: [],
    });
  }

  // Mark all cards as isOwnCard if they belong to the connected user
  for (const c of creators) {
    c.isOwnCard = c.address.toLowerCase() === me;
  }
}

async function hydrateAllCreators() {
  if (!contractAddress.value) return;
  const read = await getReadContract();
  for (const c of creators) {
    await hydrateCreator(read, c);
  }
  await refreshMyProfileState(read);
}

async function hydrateCreator(read: any, c: CreatorCard) {
  console.group(`Hydrating Creator: ${c.address}`);
  c.subscribed = false;
  c.expiresAt = undefined;

  // Check if this is the user's own card
  const isOwn = isConnected.value && c.address.toLowerCase() === account.value.toLowerCase();
  c.isOwnCard = isOwn;

  // Load profile price if active
  try {
    const active = await read.creatorActive(c.address);
    console.log(`- Active: ${active}`);
    if (active) {
      const price = await read.monthlyPriceWei(c.address);
      console.log(`- Monthly Price (Wei): ${price.toString()}`);
      c.monthlyPriceWei = BigInt(price.toString());
    }
  } catch (e) {
    console.log(`- Error fetching active/price:`, e);
  }

  // Subscription state
  if (isConnected.value) {
    try {
      const exp = await read.subscriptionExpiry(c.address, account.value);
      const expN = Number(exp.toString());
      console.log(`- Subscription Expiry (Unix): ${expN}`);
      c.expiresAt = expN;
      // Subscribed if: expiry is in future OR it's the user's own card
      c.subscribed = expN > Math.floor(Date.now() / 1000);
      console.log(`- Is Subscribed: ${c.subscribed} (Own: ${isOwn})`);
    } catch (e) {
      console.log(`- Error fetching subscription:`, e);
    }
  }

  // Can decrypt if: subscribed OR own card
  const canDecrypt = c.subscribed || isOwn;

  // Always try to use cache first (no decrypt signature needed)
  const cached = cacheRead(c.address);
  if (cached?.expiresAt && cached.expiresAt > Math.floor(Date.now() / 1000) && Array.isArray(cached.positions)) {
    console.log(`- Using cached positions (${cached.positions.length})`);
    c.positions = cached.positions;
    console.groupEnd();
    return;
  }

  // Load placeholder positions count (for display)
  let count = 0;
  try {
    count = Number((await read.getPositionCount(c.address)).toString());
    console.log(`- Position Count: ${count}`);
  } catch (e) {
    console.log(`- Error fetching position count:`, e);
    count = 0;
  }
  c.positions = Array.from({ length: count }).map((_, i) => ({
    positionId: i,
    coin: "***",
    expectationLabel: "***",
    entry: "***",
    openedAt: "***",
    target: "***",
    statusLabel: "***",
  }));

  // Don't auto-decrypt here - user must click "Refresh" button
  // This avoids constant signature requests on page load
  if (!canDecrypt) {
    cacheClear(c.address);
  }
  console.groupEnd();
  // Note: decryptCreatorPositions is now only called from:
  // - refreshAndDecrypt() (when user clicks Refresh button)
  // - addPosition() (after adding new position)
}

async function decryptCreatorPositions(read: any, c: CreatorCard, retryCount = 0) {
  if (!window.ethereum) return;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const count = Number((await read.getPositionCount(c.address)).toString());
  const positions: PositionView[] = [];

  try {
    for (let i = 0; i < count; i++) {
      console.log(`Decrypting position ${i}...`);
      const res = await read.getPosition(c.address, i);
      const handles = [
        ethers.hexlify(res[0]),
        ethers.hexlify(res[1]),
        ethers.hexlify(res[2]),
        ethers.hexlify(res[3]),
        ethers.hexlify(res[4]),
        ethers.hexlify(res[5]),
      ];
      console.log(`- Handles:`, handles);

      const decrypted = await batchDecryptValues(handles, contractAddress.value, signer);
      console.log(`- Decrypted raw values:`, decrypted);
      
      const coinCode = decrypted[handles[0]];
      const expV = decrypted[handles[1]];
      const entryV = decrypted[handles[2]];
      const openedV = decrypted[handles[3]];
      const targetV = decrypted[handles[4]];
      const statusV = decrypted[handles[5]];

      positions.push({
        positionId: i,
        coin: coinFromCode(coinCode),
        expectationLabel: expectationLabel(expV),
        entry: (entryV / 100).toFixed(2),
        openedAt: fmtDate(openedV),
        target: (targetV / 100).toFixed(2),
        statusLabel: statusLabel(statusV),
      });
    }

    c.positions = positions;
    // For own cards, c.expiresAt might be 0, so we set a default 1-hour cache life
    const cacheExpiry = (c.expiresAt && c.expiresAt > Math.floor(Date.now() / 1000)) 
      ? c.expiresAt 
      : Math.floor(Date.now() / 1000) + 3600;
    
    cacheWrite(c.address, { expiresAt: cacheExpiry, positions });
  } catch (error: any) {
    // If authorization error and own card, retry after short delay (FHEVM needs time to process FHE.allow)
    if (
      error?.message?.includes("not authorized to user decrypt") &&
      c.isOwnCard &&
      retryCount < 5
    ) {
      console.log(`Decrypt authorization pending for own card, retrying in 4s... (${retryCount + 1}/5)`);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return decryptCreatorPositions(read, c, retryCount + 1);
    }
    // For other errors or max retries, log and keep placeholder positions
    console.warn("Failed to decrypt positions for", c.address, error?.message || error);
    // Keep existing placeholder positions
  }
}

async function subscribe(c: CreatorCard) {
  if (!canWrite.value) return;
  c.isBusy = true;
  try {
    const write = await getWriteContract();
    const tx = await write.subscribe(c.address, { value: c.monthlyPriceWei, gasLimit: 2000000 });
    await tx.wait();
    
    // Give FHEVM relayer time to process FHE.allow() permissions from subscribe
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const read = await getReadContract();
    await hydrateCreator(read, c);
    // Don't auto-decrypt. User will see "Start Decryption" button.
    // Permissions are already granted by the contract's subscribe function
    // await decryptCreatorPositions(read, c);
  } catch (e: any) {
    console.error(e);
    alert(`Subscription failed: ${e?.message ?? e}`);
  } finally {
    c.isBusy = false;
  }
}

async function refreshAndDecrypt(c: CreatorCard) {
  if (!canWrite.value) return;
  c.isBusy = true;
  try {
    const read = await getReadContract();
    const write = await getWriteContract();
    
    // If not own card and subscribed, grant access first
    if (!c.isOwnCard && c.subscribed) {
      console.log("Granting access to positions...");
      const count = Number((await read.getPositionCount(c.address)).toString());
      const start = Math.max(0, count - 5);
      const ids = Array.from({ length: count - start }, (_, i) => start + i);
      
      if (ids.length > 0) {
        const txGrant = await write.grantAccess(c.address, ids, { gasLimit: 10000000 });
        await txGrant.wait();
        console.log("Access granted!");
      }
    }
    
    // Refresh data and decrypt
    await hydrateCreator(read, c);
    await decryptCreatorPositions(read, c);
  } catch (e: any) {
    console.error(e);
    alert(`Refresh failed: ${e?.message ?? e}`);
  } finally {
    c.isBusy = false;
  }
}

// Creator panel actions
function startEditProfile() {
  isEditingProfile.value = true;
}

async function refreshMyProfileState(read?: any) {
  myProfileReady.value = false;
  myMonthlyPriceWei.value = 0n;
  mySubscriptionExpiry.value = 0;
  if (!isConnected.value || !contractAddress.value) return;

  try {
    const r = read ?? (await getReadContract());

    const active = await r.creatorActive(account.value);
    const price = await r.monthlyPriceWei(account.value);
    const priceWei = BigInt(price.toString());

    myMonthlyPriceWei.value = priceWei;
    myProfileReady.value = Boolean(active) && priceWei > 0n;

    // Keep the input synced with on-chain price (handy when editing again).
    if (myProfileReady.value) {
      creatorPriceEth.value = ethers.formatEther(priceWei);
      if (!isEditingProfile.value) {
        // keep summary screen
      }
    }

    // Optional: show remaining days for "self subscription" if exists.
    const exp = await r.subscriptionExpiry(account.value, account.value);
    mySubscriptionExpiry.value = Number(exp.toString());

    // If profile exists, default to summary view.
    if (myProfileReady.value) isEditingProfile.value = false;
    
    console.log("refreshMyProfileState result:", { ready: myProfileReady.value, price: myMonthlyPriceWei.value });
  } catch (e) {
    console.error("refreshMyProfileState failed:", e);
    myProfileReady.value = false;
  }
}

async function upsertProfile() {
  console.log("upsertProfile called. canWrite:", canWrite.value);
  if (!canWrite.value) return;
  isBusy.value = true;
  try {
    const write = await getWriteContract();
    const priceWei = ethers.parseEther(String(creatorPriceEth.value || "0"));
    console.log("Sending upsertProfile tx...", priceWei);
    const tx = await write.upsertProfile(priceWei, true, { gasLimit: 600000 });
    console.log("Tx sent, waiting...", tx.hash);
    await tx.wait();
    console.log("Tx confirmed");
    await hydrateAllCreators();
    isEditingProfile.value = false;
  } catch (e) {
    console.error("upsertProfile failed:", e);
    alert("Failed to save profile: " + e);
  } finally {
    isBusy.value = false;
  }
}

async function addPosition() {
  if (!canWrite.value) return;
  if (!myProfileReady.value) {
    alert("Create your profile (save monthly fee) first, then you can add positions.");
    return;
  }
  isBusy.value = true;
  console.log("Starting addPosition...");
  console.log("Starting addPosition...");
  try {
    const write = await getWriteContract();
    const nowSec = Math.floor(Date.now() / 1000);
    const deadline = nowSec + 300;

    console.log("Encrypting position data...");
    console.log("Encrypting position data...");
    const coinCode = coinToCode(newPos.coinName);
    const enc = await encryptMany32(contractAddress.value, account.value, [
      coinCode,
      newPos.expectation,
      newPos.entryPrice,
      nowSec,
      newPos.target,
      0, // status = 0 (devam ediyor) - pozisyon oluşturulurken her zaman aktif
    ]);
    console.log("Encryption complete, sending transaction...");

    console.log("Encryption complete, sending transaction...");
    const tx = await write.addPosition(
      enc.handles[0],
      enc.handles[1],
      enc.handles[2],
      enc.handles[3],
      enc.handles[4],
      enc.handles[5],
      deadline,
      enc.inputProof,
      { gasLimit: 10000000 }
    );
    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait();
    console.log("Transaction confirmed!");
    
    // Give FHEVM relayer time to process FHE.allow() permissions
    console.log("Waiting for FHEVM relayer...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Refresh only own card first (creator can see their positions)
    const read = await getReadContract();
    const ownCard = creators.find((c) => c.address.toLowerCase() === account.value.toLowerCase());
    if (ownCard) {
      console.log("Refreshing own card...");
      console.log("Refreshing own card...");
      await hydrateCreator(read, ownCard);
      // Don't auto-decrypt. User will see "Decrypt Yourself" button.
      /*
      try {
        await decryptCreatorPositions(read, ownCard);
      } catch (decryptErr) {
        console.error("Auto-decryption failed after adding position:", decryptErr);
      }
      */
    }
    
    // Then refresh all other creators (they won't decrypt, just update counts)
    await hydrateAllCreators();
    console.log("addPosition flow complete.");
  } catch (e: any) {
    console.error("addPosition failed:", e);
    alert(`Failed to add position: ${e?.message ?? e}`);
  } finally {
    isBusy.value = false;
  }
}

onMounted(async () => {
  // Auto-hydrate if already connected
  try {
    if (window.ethereum) {
      const accs = await window.ethereum.request({ method: "eth_accounts" });
      if (accs?.length) {
        await connect();
        if (fhevmStatus.value === "idle") await initFhevm();
        await ensureCreators();
        await hydrateAllCreators();
      }
    }
  } catch {}
});
</script>

<style scoped>
/* XP-style look inspired by indx.html */
/* NOTE: <style scoped> içinde :root genelde beklendiği gibi çalışmadığı için
   CSS değişkenlerini component root'una taşıyoruz. */
.page {
  --win-grey: #c0c0c0;
  --win-blue: #000080;
  --win-blue-light: #1084d0;
  --win-border-light: #ffffff;
  --win-border-dark: #808080;
  --win-border-black: #000000;
  margin: 0;
  font-family: "MS Sans Serif", "Segoe UI", Tahoma, sans-serif;
  min-height: 100vh;
  color: #000;
  overflow-x: hidden;
}

.background-mesh {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: url('/background.jpeg') no-repeat center center fixed;
  background-size: cover;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: var(--win-grey);
  border-bottom: 2px solid var(--win-border-dark);
  box-shadow: inset 1px 1px var(--win-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
}

/* Strafhegy Logo Component Styles */
.straf-logo-component {
  --logo-scale: 0.6; 
  --primary-color: #006400; /* Koyu Yeşil */
  --secondary-color: #bc13fe;
  --text-color: #ffffff;
  
  display: inline-flex;
  align-items: center;
  gap: calc(15px * var(--logo-scale));
  font-family: 'Orbitron', sans-serif;
  background: transparent;
  user-select: none;
  cursor: pointer;
  padding: 5px;
}

.straf-icon-box {
  position: relative;
  width: calc(50px * var(--logo-scale));
  height: calc(50px * var(--logo-scale));
  display: flex;
  justify-content: center;
  align-items: center;
}

.straf-hex-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: calc(3px * var(--logo-scale)) solid var(--primary-color);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: strafSpin 10s linear infinite;
  box-shadow: 0 0 calc(10px * var(--logo-scale)) rgba(0, 243, 255, 0.4);
}

.straf-hex-inner {
  position: absolute;
  width: 55%;
  height: 55%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: strafPulse 3s ease-in-out infinite alternate;
}

.straf-dots {
  position: absolute;
  width: 140%;
  height: 140%;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  animation: strafSpinReverse 15s linear infinite;
}

.straf-text-box {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.straf-title {
  font-size: calc(28px * var(--logo-scale));
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: calc(1px * var(--logo-scale));
  background: linear-gradient(90deg, #888, var(--primary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 calc(10px * var(--logo-scale)) rgba(0, 100, 0, 0.3);
}

.straf-subtitle {
  font-size: calc(10px * var(--logo-scale));
  color: var(--secondary-color);
  letter-spacing: calc(3px * var(--logo-scale));
  margin-left: 2px;
  font-weight: 600;
}

@keyframes strafSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes strafSpinReverse {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
@keyframes strafPulse {
  0% { opacity: 0.8; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 15px var(--secondary-color); }
}

.connect-btn {
  background: var(--win-grey);
  border: 1px solid var(--win-border-black);
  box-shadow: inset 1px 1px var(--win-border-light), 1px 1px var(--win-border-dark);
  padding: 4px 16px;
  font-weight: 400;
  color: #000;
  cursor: pointer;
}
.connect-btn:active {
  box-shadow: inset 1px 1px var(--win-border-dark), 1px 1px var(--win-border-light);
  padding: 5px 15px 3px 17px;
}

.container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  justify-items: center;
}

.user-card {
  width: 100%;
  max-width: 320px;
  background: var(--win-grey);
  border: 2px solid;
  border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
  box-shadow: 1px 1px var(--win-border-black);
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 2px;
}

.creator-panel {
  max-width: 420px;
}

.card-header {
  background: linear-gradient(90deg, var(--win-blue), var(--win-blue-light));
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 13px;
}

.window-controls {
  display: flex;
  gap: 2px;
}

.win-btn {
  width: 16px;
  height: 14px;
  background: var(--win-grey);
  border: 1px solid;
  border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-weight: bold;
  color: #000;
}
.win-btn:active:not(:disabled) {
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
  padding: 1px 0 0 1px;
}
.win-btn:disabled {
  color: var(--win-border-dark);
  cursor: default;
}

.profile-section {
  padding: 15px;
  text-align: center;
  background: var(--win-grey);
}

.avatar {
  width: 64px;
  height: 64px;
  margin: 0 auto 10px;
  border: 2px solid;
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
  background: #808080;
}

.wallet-address {
  font-family: "MS Sans Serif", Tahoma, sans-serif;
  font-size: 11px;
  color: #000;
  background: #fff;
  border: 1px solid;
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
  padding: 2px 4px;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}

.positions-list {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  min-height: 300px;
  background: var(--win-grey);
}

.pos-item {
  background: var(--win-grey);
  border: 1px solid;
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.pos-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 12px;
  border-bottom: 1px solid var(--win-border-dark);
  padding-bottom: 2px;
}

.pos-details {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #000;
}

.input {
  font-size: 12px;
  padding: 2px 4px;
  background: #fff;
  border: 2px solid;
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
  width: 100%;
  box-sizing: border-box;
}

.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(192, 192, 192, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.lock-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.sub-btn {
  background: var(--win-grey) !important;
  color: #000;
  border: 1px solid var(--win-border-black);
  box-shadow: inset 1px 1px var(--win-border-light), 1px 1px var(--win-border-dark);
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
}
.sub-btn:active:not(:disabled) {
  box-shadow: inset 1px 1px var(--win-border-dark), 1px 1px var(--win-border-light);
  padding: 5px 11px 3px 13px;
}
.sub-btn:disabled {
  color: var(--win-border-dark);
  text-shadow: 1px 1px var(--win-border-light);
}

.value {
  font-weight: bold;
}

.sub-info {
  font-size: 10px;
  color: #000;
  margin-top: 4px;
  text-align: center;
}

.own-card-label {
  color: #000;
  font-weight: bold;
  border: 1px dashed var(--win-border-dark);
  padding: 2px;
}

/* Taskbar Styles */
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--win-grey);
  border-top: 2px solid var(--win-border-light);
  box-shadow: 0 -1px var(--win-border-black);
  display: flex;
  align-items: center;
  padding: 2px;
  z-index: 1000;
  gap: 4px;
}

.start-btn {
  height: 22px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  background: var(--win-grey);
  border: 1px solid var(--win-border-black);
  box-shadow: inset 1px 1px var(--win-border-light), 1px 1px var(--win-border-dark);
  font-weight: bold;
  font-size: 11px;
  cursor: pointer;
}
.start-btn:active {
  box-shadow: inset 1px 1px var(--win-border-dark), 1px 1px var(--win-border-light);
}

.start-icon {
  height: 14px;
}

.taskbar-divider {
  width: 2px;
  height: 20px;
  border-left: 1px solid var(--win-border-dark);
  border-right: 1px solid var(--win-border-light);
  margin: 0 2px;
}

.taskbar-items {
  display: flex;
  gap: 4px;
  flex-grow: 1;
  overflow-x: auto;
}

.taskbar-item {
  height: 22px;
  min-width: 100px;
  max-width: 160px;
  background: var(--win-grey);
  border: 1px solid var(--win-border-black);
  box-shadow: inset 1px 1px var(--win-border-light), 1px 1px var(--win-border-dark);
  font-size: 11px;
  text-align: left;
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.taskbar-item:active {
  box-shadow: inset 1px 1px var(--win-border-dark), 1px 1px var(--win-border-light);
}

.taskbar-clock {
  height: 22px;
  padding: 0 8px;
  border: 1px solid;
  border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
  font-size: 11px;
  display: flex;
  align-items: center;
  background: var(--win-grey);
}

/* Animations */
.user-card {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, visibility 0.4s;
  transform-origin: bottom center;
}

.minimized-anim {
  transform: translateY(100vh) scale(0.1);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

/* Adjust container for taskbar */
.container {
  padding-bottom: 60px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.how-to-use-btn {
  padding: 4px 12px;
  font-size: 12px;
  width: auto;
  height: auto;
  white-space: nowrap;
}

.contact-link {
  text-decoration: none;
  color: inherit;
}

/* Notepad Window */
.notepad-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: #fff;
  border: 2px solid;
  border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
  box-shadow: 1px 1px var(--win-border-black);
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.notepad-content {
  padding: 15px;
  font-family: "Courier New", Courier, monospace;
  font-size: 13px;
  color: #000;
  white-space: pre-wrap;
  background: #fff;
  border: 1px solid var(--win-border-dark);
  margin: 2px;
  min-height: 200px;
  overflow-y: auto;
}

.notepad-content p {
  margin: 0 0 8px 0;
}
</style>


