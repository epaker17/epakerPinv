// scripts/set-fee.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = process.env.PULSE_INVEST_ADDRESS;

  // Podłącz kontrakt
  const pulseInvest = await ethers.getContractAt("PulseInvest", contractAddress);

  // Ustaw nowe fee, np. 2% burn, 3% treasury
  const tx = await pulseInvest.connect(deployer).setFees(2, 3);
  await tx.wait();

  console.log("Nowe fee ustawione! burnFee=2%, treasuryFee=3%");
}

main().catch(console.error);
