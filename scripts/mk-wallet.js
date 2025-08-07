const { Wallet } = require("ethers");
const fs = require("fs");

const wallet = Wallet.createRandom();

console.log("==== Nowy portfel Ethereum ====");
console.log("ADDRESS:     ", wallet.address);
console.log("PRIVATE KEY: ", wallet.privateKey);
console.log("\nUWAGA! Zapisz PRIVATE KEY w bezpiecznym miejscu. Nie udostępniaj nikomu swojego klucza prywatnego!\n");

fs.writeFileSync(
  `wallet_${wallet.address}.txt`,
  `ADDRESS:     ${wallet.address}\nPRIVATE KEY: ${wallet.privateKey}\n`
);

console.log(`Dane portfela zapisane do pliku wallet_${wallet.address}.txt`);
