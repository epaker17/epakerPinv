// scripts/integration-test.js

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("▶️  Test integracyjny na Pulse Testnet V4");

  // 1) Signersi z Hardhat
  const [deployerSigner] = await ethers.getSigners();
  console.log("   Deployer: ", deployerSigner.address);

  // 2) Dodatkowe portfele z .env
  const userKey     = process.env.USER_PRIVATE_KEY;
  const attackerKey = process.env.ATTACKER_PRIVATE_KEY;
  if (!userKey || !attackerKey) {
    throw new Error("Brakuje USER_PRIVATE_KEY lub ATTACKER_PRIVATE_KEY w pliku .env");
  }
  const userSigner     = new ethers.Wallet(userKey,     ethers.provider);
  const attackerSigner = new ethers.Wallet(attackerKey, ethers.provider);

  // WALIDACJA adresów portfeli
  if (!ethers.isAddress(userSigner.address))     throw new Error("USER_PRIVATE_KEY nie tworzy poprawnego adresu!");
  if (!ethers.isAddress(attackerSigner.address)) throw new Error("ATTACKER_PRIVATE_KEY nie tworzy poprawnego adresu!");

  console.log("   User:     ", userSigner.address);
  console.log("   Attacker: ", attackerSigner.address);

  // 3) Adres skarbca & kontraktu z .env
  const treasuryAddr = process.env.TREASURY_ADDRESS;
  const pulseInvestAddress = process.env.PULSE_INVEST_ADDRESS;

  // WALIDACJA adresów kontraktów i skarbca
  if (!treasuryAddr || !ethers.isAddress(treasuryAddr)) {
    throw new Error("Brakuje TREASURY_ADDRESS w pliku .env lub nie jest poprawny!");
  }
  if (!pulseInvestAddress || !ethers.isAddress(pulseInvestAddress)) {
    throw new Error("Brakuje PULSE_INVEST_ADDRESS w pliku .env lub nie jest poprawny!");
  }
  console.log("   Treasury: ", treasuryAddr);
  console.log("   Contract: ", pulseInvestAddress);

  // 4) Podłączamy kontrakt
  const Factory = await ethers.getContractFactory("PulseInvest");
  const pulseInvest = Factory.attach(pulseInvestAddress);

  // WALIDACJA: czy pod adresem jest kontrakt
  const code = await ethers.provider.getCode(pulseInvestAddress);
  if (code === "0x") {
    throw new Error(`Podany adres ${pulseInvestAddress} nie zawiera kontraktu!`);
  }

  // 5) Odczytujemy stan i robimy transfer
  const totalSupply = await pulseInvest.totalSupply();
  console.log("⚙️  totalSupply:      ", ethers.formatUnits(totalSupply, 18), "PINV");

  const deployerBalance = await pulseInvest.balanceOf(deployerSigner.address);
  console.log("⚙️  balanceOf deployer:", ethers.formatUnits(deployerBalance, 18), "PINV");

  const amount = ethers.parseUnits("100.0", 18);
  console.log(`\n🔁  Transferujemy ${ethers.formatUnits(amount, 18)} PINV z deployera na usera…`);
  const tx = await pulseInvest.connect(deployerSigner).transfer(userSigner.address, amount);
  console.log("✅  Transfer tx hash:", tx.hash);
  await tx.wait();

  const afterDeployer = await pulseInvest.balanceOf(deployerSigner.address);
  const afterUser     = await pulseInvest.balanceOf(userSigner.address);
  console.log("🔎  balanceOf deployer:", ethers.formatUnits(afterDeployer, 18), "PINV");
  console.log("🔎  balanceOf user:    ", ethers.formatUnits(afterUser,     18), "PINV");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
