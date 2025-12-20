import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const fhearnCore = await deploy("FHEarnCore", {
    from: deployer,
    log: true,
  });

  log(`FHEarnCore deployed at: ${fhearnCore.address}`);
};

export default func;
func.id = "deploy_fhearn_core";
func.tags = ["FHEarnCore"];
