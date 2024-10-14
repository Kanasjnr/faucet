import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetModule = buildModule("ClaimFaucetModule", (m) => {

  const ClaimFaucet = m.contract("ClaimFaucet",  ["DltToken", "DLT"]);

  return { ClaimFaucet };
});

export default ClaimFaucetModule;
