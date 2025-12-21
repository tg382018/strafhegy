<template>
  <div class="page">
    <div class="background-mesh"></div>

    <AppHeader 
      :is-connected="isConnected"
      :connect-label="connectLabel"
      v-model:search-query="searchQuery"
      @toggle-wallet="onToggleWallet"
      @show-help="showHelp = true"
    />

    <SortControls v-model="sortBy" />

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
              <div class="fields-stack">
                <label class="field">
                  <span>Username</span>
                  <input v-model="myUsername" class="input" type="text" placeholder="Your username..." />
                </label>
                <label class="field">
                  <span>Monthly fee (ETH)</span>
                  <input v-model="creatorPriceEth" class="input" placeholder="0.005" />
                </label>
              </div>
              <button class="sub-btn" :disabled="!canWrite || isBusy || !myUsername.trim()" @click="upsertProfile">
                {{ isBusy ? "Processing..." : "Save Profile" }}
              </button>
            </template>
            <template v-else>
              <div class="pos-details">
                <span>Set monthly fee</span>
                <span class="value">{{ formatEth(myMonthlyPriceWei) }} ETH</span>
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
                <span>Entry price</span>
                <input v-model="newPos.entryPrice" class="input" type="text" placeholder="100.00" @input="newPos.entryPrice = cleanPriceInput(newPos.entryPrice)" />
              </label>
              <label class="field">
                <span>Target price</span>
                <input v-model="newPos.target" class="input" type="text" placeholder="120.00" @input="newPos.target = cleanPriceInput(newPos.target)" />
              </label>
            </div>
            <button class="sub-btn" :disabled="!canWrite || isBusy || !isValidPrice(newPos.entryPrice) || !isValidPrice(newPos.target)" @click="addPosition">
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
      <!-- 2. Own Card (Positions) -->
      <div v-if="ownCard" class="user-card" :class="{ 'minimized-anim': ownCard.isMinimized }">
        <div class="card-header">
          <span>{{ ownCard.username || 'User' }}.exe</span>
          <div class="window-controls">
            <button class="win-btn" @click="ownCard.isMinimized = true">_</button>
            <button class="win-btn" disabled>□</button>
            <button class="win-btn close-btn" disabled>×</button>
          </div>
        </div>

        <div class="profile-section">
          <div class="avatar" :style="{ backgroundColor: getAvatarColor(ownCard.address) }">
            <span class="avatar-initials">{{ getInitials(ownCard.address) }}</span>
          </div>
          <div class="wallet-address">{{ maskAddress(ownCard.address) }}</div>
          <div v-if="ownCard.activeSubscribers !== undefined" class="subscriber-count">
            👥 {{ ownCard.activeSubscribers }} Active Subscribers
          </div>
        </div>

        <div class="positions-list">
          <div
            v-for="pos in ownCard.positions"
            :key="pos.positionId"
            class="pos-item"
          >
            <div class="pos-header">
              <span>{{ pos.coin }}</span>
              <div class="flex items-center gap-2">
                <span>{{ pos.statusLabel }}</span>
                <button 
                  v-if="pos.statusLabel === 'In progress' && pos.coin !== '***'"
                  class="win-btn close-pos-btn"
                  :disabled="ownCard.isBusy"
                  @click="closePosition(ownCard, pos.positionId)"
                >
                  Close
                </button>
              </div>
            </div>
            <div class="pos-details">
              <span>Expectation: {{ pos.expectationLabel }}</span>
              <span>Target: {{ pos.target }}</span>
            </div>
            <div class="pos-details">
              <span>Entry: {{ pos.entry }}</span>
              <span>{{ pos.openedAt }}</span>
            </div>
          </div>

          <!-- Action buttons for own card -->
          <div class="mt-4 flex flex-col gap-2">
            <button
              v-if="ownCard.positions.some(p => p.coin === '***')"
              class="sub-btn"
              style="background: #2563eb !important;"
              :disabled="!canWrite || ownCard.isBusy"
              @click="refreshAndDecrypt(ownCard)"
            >
              {{ ownCard.isBusy ? "Processing..." : "Decrypt Yourself" }}
            </button>

            <button
              class="sub-btn secondary"
              :disabled="!canWrite || ownCard.isBusy"
              @click="refreshAndDecrypt(ownCard)"
            >
              {{ ownCard.isBusy ? "Processing..." : "Refresh (open new positions)" }}
            </button>
          </div>

          <div v-if="ownCard.expiresAt" class="sub-info">
            Days left: {{ remainingDaysFromExpiry(ownCard.expiresAt) }}
          </div>
          <div v-if="!ownCard.subscribed" class="sub-info own-card-label">
            This is your card - you can see your positions
          </div>
        </div>
      </div>

      <!-- 3. Other Creators -->
      <div v-for="creator in otherCreators" :key="creator.address" class="user-card" :class="{ 'minimized-anim': creator.isMinimized }">
        <div class="card-header">
          <span>{{ creator.username || 'User' }}.exe</span>
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
          <div v-if="creator.activeSubscribers !== undefined" class="subscriber-count">
            👥 {{ creator.activeSubscribers }} Active Subscribers
          </div>
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
              <div class="flex items-center gap-2">
                <span>{{ (creator.subscribed || creator.isOwnCard) ? pos.statusLabel : "***" }}</span>
                <button 
                  v-if="creator.isOwnCard && pos.statusLabel === 'In progress' && pos.coin !== '***'"
                  class="win-btn close-pos-btn"
                  :disabled="creator.isBusy"
                  @click="closePosition(creator, pos.positionId)"
                >
                  Close
                </button>
              </div>
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
    <Taskbar 
      :current-time="currentTime"
      :my-panel-minimized="myPanelMinimized"
      :minimized-creators="minimizedCreators"
      @restore-panel="myPanelMinimized = false"
      @restore-creator="(addr) => restoreCreator(addr)"
    />

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
import AppHeader from "./AppHeader.vue";
import Taskbar from "./Taskbar.vue";
import SortControls from "./SortControls.vue";
import { CONTRACT_ADDRESSES, SEPOLIA_CONFIG, SOCIAL_ABI } from "../constants";
import type { PositionView, CreatorCard } from "../types";


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


const creators = reactive<CreatorCard[]>([]);

const ownCard = computed(() => creators.find(c => c.isOwnCard));

const minimizedCreators = computed(() => creators.filter(c => c.isMinimized));
const sortBy = ref<'newest' | 'oldest' | 'subscribers'>('newest');

const otherCreators = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  
  // 1. Filter
  let filtered = creators.filter(c => {
    if (c.isOwnCard) return false;
    if (!c.activeProfile) return false;
    if (c.positions.length === 0) return false;
    
    if (!query) return true;
    const nameMatch = c.username.toLowerCase().includes(query);
    const addrMatch = c.address.toLowerCase().includes(query);
    return nameMatch || addrMatch;
  });

  // 2. Sort
  // We use the original index in 'creators' as a proxy for time (oldest first)
  const getOriginalIndex = (addr: string) => creators.findIndex(c => c.address === addr);

  return [...filtered].sort((a, b) => {
    if (sortBy.value === 'subscribers') {
      return (b.activeSubscribers || 0) - (a.activeSubscribers || 0);
    } else if (sortBy.value === 'newest') {
      return getOriginalIndex(b.address) - getOriginalIndex(a.address);
    } else {
      // oldest
      return getOriginalIndex(a.address) - getOriginalIndex(b.address);
    }
  });
});

function restoreCreator(address: string) {
  const c = creators.find(cr => cr.address.toLowerCase() === address.toLowerCase());
  if (c) c.isMinimized = false;
}

// Creator panel form
const creatorPriceEth = ref("0.005");
const myProfileReady = ref(false);
const isEditingProfile = ref(true);
const myMonthlyPriceWei = ref<bigint>(0n);
const mySubscriptionExpiry = ref<number>(0);
const myPanelMinimized = ref(false);
const showHelp = ref(false);
const searchQuery = ref("");
const myUsername = ref("");

const currentTime = ref("");
setInterval(() => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 1000);



const newPos = reactive({
  coinName: "ETH",
  expectation: 1,
  entryPrice: "100.00",
  target: "120.00",
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
    return Number(ethers.formatEther(wei)).toFixed(5);
  } catch {
    return "0.00000";
  }
}

function parsePrice(val: string): number {
  if (!val) return 0;
  // Replace comma with dot, remove non-numeric chars except dot
  const clean = val.replace(",", ".").replace(/[^0-9.]/g, "");
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

function cleanPriceInput(val: string): string {
  // Allow only numbers, dot, and comma
  return val.replace(/[^0-9.,]/g, "");
}

function isValidPrice(val: string): boolean {
  if (!val || !val.trim()) return false;
  // Must have at least one digit and at most one separator (dot or comma)
  const clean = val.replace(",", ".");
  const num = parseFloat(clean);
  return !isNaN(num) && num > 0;
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
      username: "",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${account.value}`,
      monthlyPriceWei: ethers.parseEther("0.005"),
      activeProfile: false,
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
  c.activeProfile = false;
  c.username = "";

  // Load profile price if active
  try {
    const active = await read.creatorActive(c.address);
    console.log(`- Active: ${active}`);
    c.activeProfile = active;
    if (active) {
      const [price, username, subCount] = await Promise.all([
        read.monthlyPriceWei(c.address),
        read.usernames(c.address),
        read.getActiveSubscriberCount(c.address)
      ]);
      console.log(`- Monthly Price (Wei): ${price.toString()}, Username: ${username}, Active Subs: ${subCount}`);
      c.monthlyPriceWei = BigInt(price.toString());
      c.username = username || "";
      c.activeSubscribers = Number(subCount.toString());
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

async function closePosition(creator: CreatorCard, positionId: number) {
  if (!canWrite.value) return;
  creator.isBusy = true;
  try {
    const write = await getWriteContract();
    const nowSec = Math.floor(Date.now() / 1000);
    const deadline = nowSec + 300;

    console.log(`Closing position ${positionId}...`);
    const enc = await encryptMany32(contractAddress.value, account.value, [1]); // 1 = Closed
    
    const tx = await write.updatePositionStatus(
      positionId,
      enc.handles[0],
      deadline,
      enc.inputProof,
      { gasLimit: 5000000 }
    );
    await tx.wait();
    console.log("Position closed!");

    // Give FHEVM relayer time to process permissions
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Refresh data
    const read = await getReadContract();
    await hydrateCreator(read, creator);
    
    // Clear cache to force re-decryption
    cacheClear(creator.address);
    
    alert("Position closed successfully!");
  } catch (e: any) {
    console.error("closePosition failed detail:", e);
    const msg = e?.message || (typeof e === 'object' ? JSON.stringify(e) : String(e));
    alert("Failed to close position: " + msg);
  } finally {
    creator.isBusy = false;
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
    const [exp, username] = await Promise.all([
      r.subscriptionExpiry(account.value, account.value),
      r.usernames(account.value)
    ]);
    mySubscriptionExpiry.value = Number(exp.toString());
    myUsername.value = username || "";

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
  if (!myUsername.value.trim()) {
    alert("Username is required!");
    return;
  }
  isBusy.value = true;
  try {
    const write = await getWriteContract();
    const priceWei = ethers.parseEther(String(creatorPriceEth.value || "0"));
    console.log("Sending upsertProfile tx...", priceWei, myUsername.value);
    const tx = await write.upsertProfile(priceWei, true, myUsername.value, { gasLimit: 1000000 });
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
    const entryVal = parsePrice(newPos.entryPrice);
    const targetVal = parsePrice(newPos.target);
    
    const enc = await encryptMany32(contractAddress.value, account.value, [
      coinCode,
      newPos.expectation,
      entryVal,
      nowSec,
      targetVal,
      0, // status = 0 (devam ediyor)
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

<style scoped src="./Strafhegy.css"></style>


