require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();
require("fs");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [
        process.env.PRIVATE_KEY_ACCOUNT,
      ],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
