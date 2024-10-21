import hre from "hardhat";

async function main() {
  const DEPLOYED_FACTORY_CONTRACT =
    "0x1cd3E3e0bA3573FDA2c3d651229a31bd0FAfc7F0";

  const myAccount = "0xF3709C87432488B6aAEb9629cf5cb5BA6Db793F0";

  const signer = await hre.ethers.getSigner(myAccount);

  const factoryContractInstance = await hre.ethers.getContractAt(
    "ClaimFaucetFactory",
    DEPLOYED_FACTORY_CONTRACT
  );

  //startting scripting
  console.log("################## Deplying claim faucet ###################");

  const deployClaimFaucetTx1 = await factoryContractInstance
    .connect(signer)
    .deployClaimFaucet("Lisk Token", "LSK");

  deployClaimFaucetTx1.wait();

  const deployClaimFaucetTx2 = await factoryContractInstance
    .connect(signer)
    .deployClaimFaucet("Starknet Token", "STK");

  deployClaimFaucetTx2.wait();

  console.log({ "Claim faucet 2 deployed to": deployClaimFaucetTx2 });

  console.log(
    "################ Getting the of length & data of deoloyed claim faucet ##################"
  );

  const getLengthOfDeployedContract =
    await factoryContractInstance.getLengthDeployedContracts();

  console.log({ "Lenght faucet": getLengthOfDeployedContract.toString() });

  const getUserContracts = await factoryContractInstance
    .connect(signer)
    .getUserDeployedContracts();

  console.table(getUserContracts);

  console.log(
    "################### Getting User Deployed Claim faucet by Index #################"
  );

  const { deployer_: deployerA, deployedContract_: deployedContractA } =
    await factoryContractInstance
      .connect(signer)
      .getUserDeployedContractByIndex(0);

  const { deployer_: deployerB, deployedContract_: deployedContractB } =
    await factoryContractInstance
      .connect(signer)
      .getUserDeployedContractByIndex(1);

  console.log([
    {
      Deployer: deployerA,
      "Deployed Contract Address": deployedContractA,
    },
    { Deployer: deployerB, "Deployed Contract Address": deployedContractB },
  ]);

  console.log("######## Getting Deployed Contract Address Info #########");

  const contractInfo = await factoryContractInstance.getInfoFromContract(
    deployedContractA
  );

  console.table(contractInfo);

  const contractInfo2 = await factoryContractInstance.getInfoFromContract(
    deployedContractB
  );

  console.table(contractInfo2);

  console.log("######## Claiming Token And Getting User Balance #########");

  const claimTokenFaucetTx1 = await factoryContractInstance
    .connect(signer)
    .claimFaucetFromContract(deployedContractA);

  claimTokenFaucetTx1.wait();

  const claimTokenFaucetTx2 = await factoryContractInstance
    .connect(signer)
    .claimFaucetFromContract(deployedContractB);

  claimTokenFaucetTx2.wait();

  const checkUserBalForToken1 = await factoryContractInstance
    .connect(signer)
    .getBalanceFromDeployedContract(deployedContractA);
  const checkUserBalForToken2 = await factoryContractInstance
    .connect(signer)
    .getBalanceFromDeployedContract(deployedContractB);

  console.log({
    "Faucet 1 Balance": hre.ethers.formatUnits(checkUserBalForToken1, 18),
    "Faucet 2 Balance": hre.ethers.formatUnits(checkUserBalForToken2,18),
  });
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
