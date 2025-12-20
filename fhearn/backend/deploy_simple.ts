import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FHEarnStake contract...");

  const FHEarnStake = await ethers.getContractFactory("FHEarnStake");
  const fhearnStake = await FHEarnStake.deploy();

  await fhearnStake.waitForDeployment();

  const address = await fhearnStake.getAddress();
  console.log("FHEarnStake deployed to:", address);

  // Save address to file
  const fs = require("fs");
  const contractInfo = {
    address: address,
    network: "sepolia",
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync("deployed_contract.json", JSON.stringify(contractInfo, null, 2));
  console.log("Contract info saved to deployed_contract.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

