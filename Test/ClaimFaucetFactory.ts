import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { ClaimFaucetFactory } from "../typechain-types/ClaimFaucetFactory";

describe("ClaimFaucetFactory Test", function () {
  async function deployClaimFaucetFactoryFixture() {
    const [owner, addr1] = await hre.ethers.getSigners();

    const ClaimFaucetFactory = await hre.ethers.getContractFactory("ClaimFaucetFactory");
    const claimFaucetFactory = await ClaimFaucetFactory.deploy();

    return { claimFaucetFactory, owner, addr1 };
  }

  it("Should deploy a new ClaimFaucet contract", async function () {
    const { claimFaucetFactory, owner } = await loadFixture(deployClaimFaucetFactoryFixture);

    const tx = await claimFaucetFactory.deployClaimFaucet("TestToken", "TT");
    await tx.wait();
    
    const deployedContracts = await claimFaucetFactory.getAllContractDeployed();
    expect(deployedContracts.length).to.equal(1);
    expect(deployedContracts[0].deployer).to.equal(await owner.getAddress());
  });

  it("Should return user's deployed contracts", async function () {
    const { claimFaucetFactory, addr1 } = await loadFixture(deployClaimFaucetFactoryFixture);

    await claimFaucetFactory.connect(addr1).deployClaimFaucet("Token1", "T1");
    await claimFaucetFactory.connect(addr1).deployClaimFaucet("Token2", "T2");

    const userContracts = await claimFaucetFactory.connect(addr1).getUserDeployedContracts();
    expect(userContracts.length).to.equal(2);
  });

  it("Should return the correct contract info by index", async function () {
    const { claimFaucetFactory, owner } = await loadFixture(deployClaimFaucetFactoryFixture);

    await claimFaucetFactory.deployClaimFaucet("Token1", "T1");
    const contractInfo = await claimFaucetFactory.getUserDeployedContractByIndex(0);
    expect(contractInfo.deployer_).to.equal(await owner.getAddress());
  });

  it("Should return the correct number of deployed contracts", async function () {
    const { claimFaucetFactory } = await loadFixture(deployClaimFaucetFactoryFixture);

    await claimFaucetFactory.deployClaimFaucet("Token1", "T1");
    await claimFaucetFactory.deployClaimFaucet("Token2", "T2");

    const length = await claimFaucetFactory.getLengthDeployedContracts();
    expect(length).to.equal(2);
  });

  it("Should return the correct token info", async function () {
    const { claimFaucetFactory } = await loadFixture(deployClaimFaucetFactoryFixture);

    const tx = await claimFaucetFactory.deployClaimFaucet("TestToken", "TT");
    await tx.wait();
    const deployedContractInfo = await claimFaucetFactory.getUserDeployedContractByIndex(0);

    const [name, symbol] = await claimFaucetFactory.getInfoFromContract(deployedContractInfo.deployedContract_);
    expect(name).to.equal("TestToken");
    expect(symbol).to.equal("TT");
  });
});