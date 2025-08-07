require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // Adres kontraktu i adres do ustawienia wyjątku pobieramy z .env lub wpisujemy ręcznie:
  const contractAddress = process.env.PULSE_INVEST_ADDRESS;
  const lpAddress = process.env.LP_ADDRESS;
  const exempt = process.env.EXEMPT === "false" ? false : true; // domyślnie true

  if (!contractAddress || !lpAddress) {
    throw new Error("Ustaw PULSE_INVEST_ADDRESS i LP_ADDRESS w pliku .env");
  }

  const [owner] = await ethers.getSigners();
  const PulseInvest = await ethers.getContractFactory("PulseInvest");
  const token = PulseInvest.attach(contractAddress);

  const tx = await token.connect(owner).setFeeExempt(lpAddress, exempt);
  await tx.wait();

  if (exempt) {
    console.log(`✅ Adres ${lpAddress} został DODANY do wyjątków od fee!`);
  } else {
    console.log(`ℹ️  Adres ${lpAddress} został USUNIĘTY z wyjątków od fee.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
