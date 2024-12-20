import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Размещение контракта Voting
  const proposalNames = ["Alice", "Jo", "Charlie"];
  const votingDeployment = await deploy("YourContract", {
    from: deployer,
    args: [proposalNames],
    log: true,
  });
  console.log("Voting контракт задеплоен по адресу:", votingDeployment.address);
};

module.exports.tags = ["YourContract"];

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
