import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const fhearnStake = await deploy("FHEarnStake", {
    from: deployer,
    log: true,
    value: 0, // No initial ETH needed
  });

  log(`FHEarnStake deployed at: ${fhearnStake.address}`);
};

export default func;
func.id = "01_deploy_fhearn_stake";
func.tags = ["FHEarnStake"];
