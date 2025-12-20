import { computed, ref } from "vue";
import type { Signer } from "ethers";

// Minimal in-app SDK wrapper for browser usage.
// Uses Relayer SDK (0.3.0-5) loaded via script tag in `index.html`.

declare global {
  interface Window {
    ethereum?: any;
    RelayerSDK?: any;
    relayerSDK?: any;
  }
}

let fheInstance: any = null;

export async function initializeFheInstance() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found (MetaMask).");
  }

  const sdk = window.RelayerSDK || window.relayerSDK;
  if (!sdk) {
    throw new Error(
      "RelayerSDK not loaded. Ensure script tag exists in index.html for relayer-sdk-js.umd.cjs"
    );
  }

  const { initSDK, createInstance, SepoliaConfig } = sdk;
  await initSDK();
  fheInstance = await createInstance({ ...SepoliaConfig, network: window.ethereum });
  return fheInstance;
}

export function getFheInstance() {
  return fheInstance;
}

/**
 * Batch decrypt multiple handles using EIP-712 user decrypt (FHEVM 0.9.x).
 * Returns an object mapping handle -> number.
 */
export async function batchDecryptValues(
  handles: string[],
  contractAddress: string,
  signer: Signer
): Promise<Record<string, number>> {
  const fhe = getFheInstance();
  if (!fhe) throw new Error("FHE instance not initialized. Call initialize first.");
  if (!handles?.length) return {};

  const keypair = fhe.generateKeypair();
  const handleContractPairs = handles.map((handle) => ({
    handle,
    contractAddress,
  }));

  const startTimeStamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = "10";
  const contractAddresses = [contractAddress];

  const eip712 = fhe.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays
  );

  // ethers v6 signer
  const signature = await (signer as any).signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
    },
    eip712.message
  );

  const result = await fhe.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    contractAddresses,
    await (signer as any).getAddress(),
    startTimeStamp,
    durationDays
  );

  const out: Record<string, number> = {};
  for (const h of handles) out[h] = Number(result[h]);
  return out;
}

// Vue composables (subset we need)

export function useWalletVue() {
  const address = ref<string>("");
  const isConnected = ref<boolean>(false);
  const chainId = ref<number>(0);
  const isConnecting = ref<boolean>(false);
  const error = ref<string>("");

  const connect = async () => {
    if (!window.ethereum) {
      error.value = "MetaMask not detected";
      return;
    }
    try {
      isConnecting.value = true;
      error.value = "";
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts?.length) {
        address.value = accounts[0];
        isConnected.value = true;
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
        chainId.value = parseInt(chainIdHex, 16);
      }
    } catch (err: any) {
      error.value = err?.message ?? "Connection failed";
    } finally {
      isConnecting.value = false;
    }
  };

  const disconnect = () => {
    address.value = "";
    isConnected.value = false;
    chainId.value = 0;
    error.value = "";
  };

  return {
    address: computed(() => address.value),
    isConnected: computed(() => isConnected.value),
    chainId: computed(() => chainId.value),
    isConnecting: computed(() => isConnecting.value),
    error: computed(() => error.value),
    connect,
    disconnect,
  };
}

export function useFhevmVue() {
  const status = ref<"idle" | "loading" | "ready" | "error">("idle");
  const error = ref<string>("");

  const initialize = async () => {
    try {
      status.value = "loading";
      error.value = "";
      await initializeFheInstance();
      status.value = "ready";
    } catch (err: any) {
      status.value = "error";
      error.value = err?.message ?? "FHEVM initialization failed";
    }
  };

  return {
    status: computed(() => status.value),
    error: computed(() => error.value),
    initialize,
    isInitialized: computed(() => status.value === "ready"),
  };
}



