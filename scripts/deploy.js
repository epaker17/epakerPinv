// scripts/deploy.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deployujemy z adresu:", deployer.address);

  const treasury = process.env.TREASURY_ADDRESS;

  // WALIDACJA adresu skarbca (czy istnieje i jest poprawny)
  if (!treasury || !ethers.isAddress(treasury)) {
    throw new Error("TREASURY_ADDRESS nie jest ustawiony lub nie jest poprawnym adresem Ethereum!");
  }

  console.log("Adres skarbca:", treasury);

  const PulseInvest = await ethers.getContractFactory("PulseInvest");
  const pulseInvest = await PulseInvest.deploy(treasury);

  console.log("Czekamy na zakończenie wdrożenia…");
  await pulseInvest.waitForDeployment();

  console.log("PulseInvest wdrożony pod adresem:", pulseInvest.target);

  // Link do explorera
  console.log("Zobacz kontrakt na explorerze:");
  console.log(`https://scan.v4.testnet.pulsechain.com/address/${pulseInvest.target}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
