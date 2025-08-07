require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.PULSE_INVEST_ADDRESS;
  const pulseInvest = await ethers.getContractAt("PulseInvest", contractAddress);

  const burn = await pulseInvest.burnFee();
  const treasury = await pulseInvest.treasuryFee();

  console.log(`Aktualne fee: burnFee=${burn}%, treasuryFee=${treasury}%`);
}

main().catch(console.error);
