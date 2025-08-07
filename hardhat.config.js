require("solidity-coverage");
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.8.24" }
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    pulseTestnet: { // Uprość nazwę na 'pulseTestnet', bo taką konwencję podaje się do polecenia
      url: process.env.PULSE_TESTNET_RPC || "https://rpc.v4.testnet.pulsechain.com",
      chainId: 943, // Poprawne chainId dla PulseChain Testnet V4 to 943!
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY
      ].filter(Boolean) // W deploymencie potrzebujesz tylko deployera
    }
  }
};
