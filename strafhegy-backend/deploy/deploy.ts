import { ethers } from "hardhat";

async function main() {
  console.log("Deploying StrafhegySocial_uint32 contract...");
  const StrafhegySocial = await ethers.getContractFactory("StrafhegySocial_uint32");
  const strafhegySocial = await StrafhegySocial.deploy();
  await strafhegySocial.waitForDeployment();
  const socialAddress = await strafhegySocial.getAddress();
  console.log(`StrafhegySocial_uint32 contract deployed to: ${socialAddress}`);

  console.log("\n=== Deployment Summary ===");
  console.log(`StrafhegySocial_uint32: ${socialAddress}`);
}

// Export the main function for hardhat-deploy
export default main;