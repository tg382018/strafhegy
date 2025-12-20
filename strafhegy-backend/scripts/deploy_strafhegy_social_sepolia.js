/* eslint-disable no-console */
// Deploy StrafhegySocial_uint32 to Sepolia WITHOUT Hardhat compile (soliditylang.org is blocked in some envs).
// Uses solc-js from npm + ethers.
//
// Required env (in ./strafhegy-backend/.env):
// - PRIVATE_KEY=0x...
// Optional:
// - SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io

const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function resolveImport(importPath, fromFile) {
  // @scope/pkg/... -> node_modules
  if (importPath.startsWith("@")) {
    return path.join(__dirname, "..", "node_modules", importPath);
  }
  // relative import
  if (importPath.startsWith(".")) {
    return path.resolve(path.dirname(fromFile), importPath);
  }
  // bare package import (e.g. encrypted-types/EncryptedTypes.sol)
  const nodeModulesCandidate = path.join(__dirname, "..", "node_modules", importPath);
  if (fs.existsSync(nodeModulesCandidate)) return nodeModulesCandidate;

  // fallback: treat as relative to contracts
  return path.join(__dirname, "..", "contracts", importPath);
}

function compileContract({ contractFile, contractName }) {
  const solc = require("solc");

  const absFile = path.join(__dirname, "..", "contracts", contractFile);
  const source = fs.readFileSync(absFile, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      [contractFile]: {
        content: source,
      },
    },
    settings: {
      optimizer: { enabled: true, runs: 800 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };

  const output = JSON.parse(
    solc.compile(JSON.stringify(input), {
      import: (importPath) => {
        try {
          const resolved = resolveImport(importPath, absFile);
          const contents = fs.readFileSync(resolved, "utf8");
          return { contents };
        } catch (e) {
          return { error: `Import not found: ${importPath}` };
        }
      },
    })
  );

  if (output.errors && output.errors.length) {
    const fatal = output.errors.filter((e) => e.severity === "error");
    for (const e of output.errors) {
      console.error(e.formattedMessage || e.message);
    }
    if (fatal.length) throw new Error("Solidity compilation failed");
  }

  const compiled = output.contracts?.[contractFile]?.[contractName];
  if (!compiled) throw new Error(`Missing compiled output for ${contractFile}:${contractName}`);

  const abi = compiled.abi;
  const bytecode = compiled.evm?.bytecode?.object;
  if (!bytecode) throw new Error("Missing bytecode");

  return { abi, bytecode: "0x" + bytecode };
}

async function main() {
  loadEnv();

  const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is missing (set it in strafhegy-backend/.env)");

  const rpcCandidates = process.env.SEPOLIA_RPC_URL
    ? [process.env.SEPOLIA_RPC_URL]
    : [
        "https://rpc.sepolia.org",
        "https://ethereum-sepolia.publicnode.com",
        "https://sepolia.drpc.org",
        "https://endpoints.omniatech.io/v1/eth/sepolia/public",
        "https://1rpc.io/sepolia",
      ];

  const { ethers } = require("ethers");

  console.log("Compiling StrafhegySocial_uint32.sol with solc-js...");
  const { abi, bytecode } = compileContract({
    contractFile: "StrafhegySocial_uint32.sol",
    contractName: "StrafhegySocial_uint32",
  });

  let rpcUrl = "";
  let provider = null;
  for (const url of rpcCandidates) {
    try {
      const p = new ethers.JsonRpcProvider(url);
      await p.getBlockNumber();
      rpcUrl = url;
      provider = p;
      break;
    } catch {
      // try next
    }
  }
  if (!provider || !rpcUrl) {
    throw new Error(
      "No working Sepolia RPC found. Please set SEPOLIA_RPC_URL in strafhegy-backend/.env (Alchemy/Infura/your provider)."
    );
  }
  console.log("Connecting to Sepolia RPC:", rpcUrl);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const bal = await provider.getBalance(wallet.address);
  console.log("Deployer:", wallet.address);
  console.log("Balance (ETH):", ethers.formatEther(bal));

  console.log("Deploying StrafhegySocial_uint32...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  console.log("Tx:", contract.deploymentTransaction()?.hash);
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log("✅ Deployed StrafhegySocial_uint32 at:", addr);

  const outPath = path.join(__dirname, "..", "deployed_strafhegy_social.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        contract: "StrafhegySocial_uint32",
        address: addr,
        chainId: 11155111,
        rpcUrl,
        deployedAt: new Date().toISOString(),
        deployer: wallet.address,
      },
      null,
      2
    )
  );
  console.log("Saved:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


