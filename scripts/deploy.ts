import { ethers, defender } from "hardhat";

async function main() {
  const ppoppo = await ethers.getContractFactory("ppoppo");

  const upgradeApprovalProcess = await defender.getUpgradeApprovalProcess();

  if (upgradeApprovalProcess.address === undefined) {
    throw new Error(`Upgrade approval process with id ${upgradeApprovalProcess.approvalProcessId} has no assigned address`);
  }

  const deployment = await defender.deployProxy(ppoppo, [upgradeApprovalProcess.address], { initializer: "initialize" });

  await deployment.waitForDeployment();

  console.log(`Contract deployed to ${await deployment.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});