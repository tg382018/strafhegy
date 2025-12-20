import { ethers } from "hardhat";

async function main() {
  console.log("Checking if contract exists on Sepolia...");

  const contractAddress = "0xab95caFFd4d6C38a1A4569044e3004AD1a779706";

  try {
    // Try to get contract code
    const code = await ethers.provider.getCode(contractAddress);
    console.log("Contract code length:", code.length);

    if (code === "0x") {
      console.log("❌ Contract does NOT exist on Sepolia");
      console.log("The contract was not properly deployed or the address is wrong");
    } else {
      console.log("✅ Contract EXISTS on Sepolia");
      console.log("Contract code found, length:", code.length);
    }

    // Try to create contract instance
    const FHEarnStake = await ethers.getContractFactory("FHEarnStake");
    const contract = FHEarnStake.attach(contractAddress);

    console.log("Contract instance created successfully");
  } catch (error) {
    console.error("Error checking contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

