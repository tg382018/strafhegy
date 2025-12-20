<template>
  <div class="page">
    <div class="background-mesh"></div>

    <header>
      <div class="logo">
        <span class="logo-xp">XP</span>
        Strafhegy SocialFi
      </div>

      <button class="connect-btn" :class="{ connected: isConnected }" @click="onToggleWallet">
        {{ connectLabel }}
      </button>
    </header>

    <div class="container">
      <!-- Creator panel (for testing / demo) -->
      <div class="user-card creator-panel">
        <div class="card-header">
          <span>Creator.exe</span>
          <div class="window-controls">
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
        </div>
        <div class="profile-section">
          <div class="wallet-address">
            {{ isConnected ? account : "Cüzdan bağla (creator panel)" }}
          </div>
        </div>
        <div class="positions-list">
          <div class="pos-item">
            <div class="pos-header">
              <span>Profil</span>
              <span>{{ contractAddress ? "Contract OK" : "Contract gerekli" }}</span>
            </div>
            <template v-if="isEditingProfile || !myProfileReady">
              <div class="pos-details">
                <span>Aylık ücret (ETH)</span>
                <input v-model="creatorPriceEth" class="input" placeholder="0.005" />
              </div>
              <button class="sub-btn" :disabled="!canWrite || isBusy" @click="upsertProfile">
                {{ isBusy ? "İşleniyor..." : "Profili Kaydet" }}
              </button>
            </template>
            <template v-else>
              <div class="pos-details">
                <span>Ayarlanan aylık ücret</span>
                <span class="value">{{ formatEth(myMonthlyPriceWei) }} ETH</span>
              </div>
              <div class="pos-details">
                <span>Kalan gün</span>
                <span class="value">{{ myRemainingDaysLabel }}</span>
              </div>
              <button class="sub-btn secondary" :disabled="isBusy" @click="startEditProfile">Aylık ücreti değiştir</button>
            </template>
          </div>

          <div v-if="myProfileReady && !isEditingProfile" class="pos-item">
            <div class="pos-header">
              <span>Pozisyon Ekle</span>
              <span>Şifreli</span>
            </div>
            <div class="fields-stack">
              <label class="field">
                <span>Coin</span>
                <input v-model="newPos.coinName" class="input" type="text" placeholder="ETH, BTC, SOL..." />
              </label>
              <label class="field">
                <span>Beklenti</span>
                <select v-model.number="newPos.expectation" class="input">
                  <option :value="1">Yükseliş</option>
                  <option :value="0">Düşüş</option>
                </select>
              </label>
              <label class="field">
                <span>Giriş fiyatı (x100)</span>
                <input v-model.number="newPos.entryPrice" class="input" type="number" placeholder="10000" />
              </label>
              <label class="field">
                <span>Hedef fiyat (x100)</span>
                <input v-model.number="newPos.target" class="input" type="number" placeholder="12000" />
              </label>
            </div>
            <button class="sub-btn" :disabled="!canWrite || isBusy" @click="addPosition">
              {{ isBusy ? "İşleniyor..." : "Pozisyon Ekle" }}
            </button>
            <div class="sub-info">
              Pozisyon oluşturulduğunda durum otomatik "Devam ediyor" olur.
            </div>
          </div>

          <div v-else class="pos-item">
            <div class="pos-header">
              <span>Pozisyon Ekle</span>
              <span>Kilitli</span>
            </div>
            <div class="sub-info">Pozisyon eklemek için önce profilini oluştur (aylık ücretini kaydet).</div>
          </div>
        </div>
      </div>

      <!-- Creator cards -->
      <div v-for="creator in creators" :key="creator.address" class="user-card">
        <div class="card-header">
          <span>User.exe</span>
          <div class="window-controls">
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
        </div>

        <div class="profile-section">
          <div class="avatar">
            <img :src="creator.avatar" alt="avatar" />
          </div>
          <div class="wallet-address">{{ maskAddress(creator.address) }}</div>
        </div>

        <div class="positions-list">
          <!-- Locked overlay (only for non-subscribers AND not own card) -->
          <div v-if="!creator.subscribed && !creator.isOwnCard" class="locked-overlay">
            <div class="lock-icon">🔒</div>
            <button class="sub-btn" :disabled="!canWrite || creator.isBusy" @click="subscribe(creator)">
              {{ creator.isBusy ? "İşleniyor..." : "Abone Ol" }}
            </button>
            <div class="sub-info">
              {{ canWrite ? `1 ay erişim (${formatEth(creator.monthlyPriceWei)} ETH)` : "Portföyü görmek için cüzdan bağla" }}
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
              <span>Beklenti: {{ (creator.subscribed || creator.isOwnCard) ? pos.expectationLabel : "***" }}</span>
              <span>Hedef: {{ (creator.subscribed || creator.isOwnCard) ? pos.target : "***" }}</span>
            </div>
            <div class="pos-details">
              <span>Giriş: {{ (creator.subscribed || creator.isOwnCard) ? pos.entry : "***" }}</span>
              <span>{{ (creator.subscribed || creator.isOwnCard) ? pos.openedAt : "***" }}</span>
            </div>
          </div>

          <button
            v-if="creator.subscribed || creator.isOwnCard"
            class="sub-btn secondary"
            :disabled="!canWrite || creator.isBusy"
            @click="refreshAndDecrypt(creator)"
          >
            {{ creator.isBusy ? "İşleniyor..." : "Refresh (yeni pozisyonları aç)" }}
          </button>
          <div v-if="(creator.subscribed || creator.isOwnCard) && creator.expiresAt" class="sub-info">
            Kalan gün: {{ remainingDaysFromExpiry(creator.expiresAt) }}
          </div>
          <div v-if="creator.isOwnCard && !creator.subscribed" class="sub-info own-card-label">
            Bu senin kartın - pozisyonlarını görebilirsin
          </div>
        </div>
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
  11155111: "0x294A0535C6f9Ea83b11DA2D002C56FED908330D9", // Sepolia (updated with getAllCreators)
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
  if (!isConnected.value) return "Cüzdan Bağla";
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
  positions: PositionView[];
};

const creators = reactive<CreatorCard[]>([]);

// Creator panel form
const creatorPriceEth = ref("0.005");
const myProfileReady = ref(false);
const isEditingProfile = ref(true);
const myMonthlyPriceWei = ref<bigint>(0n);
const mySubscriptionExpiry = ref<number>(0);

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

function formatEth(wei: bigint) {
  try {
    return Number(ethers.formatEther(wei)).toFixed(3);
  } catch {
    return "0.000";
  }
}

function coinFromCode(code: number) {
  const map: Record<number, string> = { 1: "ETH", 2: "BTC", 3: "SOL", 4: "AVAX", 5: "LINK", 6: "UNI" };
  return map[code] ?? `COIN#${code}`;
}

function coinToCode(name: string): number {
  const map: Record<string, number> = { ETH: 1, BTC: 2, SOL: 3, AVAX: 4, LINK: 5, UNI: 6 };
  const upper = name.trim().toUpperCase();
  return map[upper] ?? 99; // 99 = unknown coin
}

function expectationLabel(v: number) {
  return v === 1 ? "Yükseliş" : "Düşüş";
}

function statusLabel(v: number) {
  return v === 1 ? "Kapatıldı" : "Devam ediyor";
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
  return `strafhegy_cache_${chainId.value}_${creator.toLowerCase()}`;
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
    await connect();
    if (chainId.value !== 11155111) await switchToSepolia();
    if (isConnected.value && fhevmStatus.value === "idle") await initFhevm();
    await ensureCreators();
    await hydrateAllCreators();
  } else {
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
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${addr}`,
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
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.value}`,
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
  c.subscribed = false;
  c.expiresAt = undefined;

  // Check if this is the user's own card
  const isOwn = isConnected.value && c.address.toLowerCase() === account.value.toLowerCase();
  c.isOwnCard = isOwn;

  // Load profile price if active
  try {
    const active = await read.creatorActive(c.address);
    if (active) {
      const price = await read.monthlyPriceWei(c.address);
      c.monthlyPriceWei = BigInt(price.toString());
    }
  } catch {}

  // Subscription state
  if (isConnected.value) {
    try {
      const exp = await read.subscriptionExpiry(c.address, account.value);
      const expN = Number(exp.toString());
      c.expiresAt = expN;
      // Subscribed if: expiry is in future OR it's the user's own card
      c.subscribed = expN > Math.floor(Date.now() / 1000);
    } catch {}
  }

  // Can decrypt if: subscribed OR own card
  const canDecrypt = c.subscribed || isOwn;

  // If can decrypt and cache valid, use it
  const cached = cacheRead(c.address);
  if (canDecrypt && cached?.expiresAt && cached.expiresAt > Math.floor(Date.now() / 1000) && Array.isArray(cached.positions)) {
    c.positions = cached.positions;
    return;
  }

  // Otherwise, load placeholder positions count
  let count = 0;
  try {
    count = Number((await read.getPositionCount(c.address)).toString());
  } catch {
    count = 0;
  }
  c.positions = Array.from({ length: Math.max(1, count || 1) }).map((_, i) => ({
    positionId: i,
    coin: "",
    expectationLabel: "",
    entry: "",
    openedAt: "",
    target: "",
    statusLabel: "",
  }));

  if (!canDecrypt) {
    cacheClear(c.address);
    return;
  }

  // Can decrypt (subscribed or own card) but not cached -> decrypt now
  await decryptCreatorPositions(read, c);
}

async function decryptCreatorPositions(read: any, c: CreatorCard) {
  if (!window.ethereum) return;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const count = Number((await read.getPositionCount(c.address)).toString());
  const positions: PositionView[] = [];

  for (let i = 0; i < count; i++) {
    const res = await read.getPosition(c.address, i);
    const handles = [
      ethers.hexlify(res[0]),
      ethers.hexlify(res[1]),
      ethers.hexlify(res[2]),
      ethers.hexlify(res[3]),
      ethers.hexlify(res[4]),
      ethers.hexlify(res[5]),
    ];

    const decrypted = await batchDecryptValues(handles, contractAddress.value, signer);
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
  cacheWrite(c.address, { expiresAt: c.expiresAt ?? Math.floor(Date.now() / 1000) + 3600, positions });
}

async function subscribe(c: CreatorCard) {
  if (!canWrite.value) return;
  c.isBusy = true;
  try {
    const write = await getWriteContract();
    const tx = await write.subscribe(c.address, { value: c.monthlyPriceWei, gasLimit: 900000 });
    await tx.wait();
    const read = await getReadContract();
    await hydrateCreator(read, c);
  } catch (e: any) {
    console.error(e);
    alert(`Abonelik başarısız: ${e?.message ?? e}`);
  } finally {
    c.isBusy = false;
  }
}

async function refreshAndDecrypt(c: CreatorCard) {
  if (!canWrite.value) return;
  c.isBusy = true;
  try {
    const write = await getWriteContract();
    const tx = await write.refreshAccess(c.address, { gasLimit: 900000 });
    await tx.wait();
    const read = await getReadContract();
    await decryptCreatorPositions(read, c);
  } catch (e: any) {
    console.error(e);
    alert(`Refresh başarısız: ${e?.message ?? e}`);
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
  } catch {
    myProfileReady.value = false;
  }
}

async function upsertProfile() {
  if (!canWrite.value) return;
  isBusy.value = true;
  try {
    const write = await getWriteContract();
    const priceWei = ethers.parseEther(String(creatorPriceEth.value || "0"));
    const tx = await write.upsertProfile(priceWei, true, { gasLimit: 600000 });
    await tx.wait();
    await hydrateAllCreators();
    isEditingProfile.value = false;
  } finally {
    isBusy.value = false;
  }
}

async function addPosition() {
  if (!canWrite.value) return;
  if (!myProfileReady.value) {
    alert("Önce profilini oluştur (aylık ücretini kaydet), sonra pozisyon ekleyebilirsin.");
    return;
  }
  isBusy.value = true;
  try {
    const write = await getWriteContract();
    const nowSec = Math.floor(Date.now() / 1000);
    const deadline = nowSec + 300;

    const coinCode = coinToCode(newPos.coinName);
    const enc = await encryptMany32(contractAddress.value, account.value, [
      coinCode,
      newPos.expectation,
      newPos.entryPrice,
      nowSec,
      newPos.target,
      0, // status = 0 (devam ediyor) - pozisyon oluşturulurken her zaman aktif
    ]);

    const tx = await write.addPosition(
      enc.handles[0],
      enc.handles[1],
      enc.handles[2],
      enc.handles[3],
      enc.handles[4],
      enc.handles[5],
      deadline,
      enc.inputProof,
      { gasLimit: 1200000 }
    );
    await tx.wait();
    await hydrateAllCreators();
  } catch (e: any) {
    console.error(e);
    alert(`Pozisyon ekleme başarısız: ${e?.message ?? e}`);
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
  --xp-blue: #0050ef;
  --xp-bar-grad-start: #2b7de0;
  --xp-bar-grad-end: #174eb6;
  --bg-glass: rgba(255, 255, 255, 0.9);
  --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  margin: 0;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: linear-gradient(135deg, #286ed6 0%, #6da6e2 100%);
  min-height: 100vh;
  color: #333;
  overflow-x: hidden;
}

.background-mesh {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(0, 255, 100, 0.1) 0%, transparent 25%);
  background-size: cover;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-weight: 800;
  font-size: 24px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-xp {
  background: white;
  color: #0050ef;
  padding: 0 8px;
  border-radius: 4px;
}

.connect-btn {
  background: #111;
  border: 1px solid #000;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.connect-btn:hover {
  transform: translateY(-2px);
  background: #000;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}
.connect-btn.connected {
  background: #000;
  color: #fff;
  border-color: #000;
}

.container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  justify-items: center;
}

.user-card {
  width: 100%;
  max-width: 320px;
  background: var(--bg-glass);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  position: relative;
}
.user-card:hover {
  transform: translateY(-5px);
}
.creator-panel {
  max-width: 420px;
}

.card-header {
  background: linear-gradient(180deg, var(--xp-bar-grad-start) 0%, var(--xp-bar-grad-end) 100%);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-bottom: 2px solid #ff9933;
}

.window-controls .dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 6px;
  background-color: rgba(255, 255, 255, 0.3);
}
.dot-yellow {
  background: #ffbd2e !important;
}
.dot-green {
  background: #27c93f !important;
}

.profile-section {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
  background: #fdfdfd;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ddd;
  margin: 0 auto 10px;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wallet-address {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 14px;
  color: #555;
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.positions-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  min-height: 300px;
  position: relative;
}

.pos-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pos-header {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 15px;
}

.pos-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  gap: 10px;
  align-items: center;
}

.input {
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  width: 140px;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}
.field .input {
  width: 100%;
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 12px 12px;
  z-index: 10;
}

.lock-icon {
  font-size: 40px;
  margin-bottom: 10px;
  color: #888;
}

.sub-btn {
  background: #111 !important;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}
.sub-btn:hover {
  transform: scale(1.03);
  background: #000 !important;
}
.sub-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.sub-btn.secondary {
  background: #222 !important;
  box-shadow: none;
}

.value {
  font-weight: 700;
  color: #111;
}

.sub-info {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  text-align: center;
}

.own-card-label {
  color: #2e7d32;
  font-weight: 600;
  background: #e8f5e9;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>


