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
      url: "https://eth-sepolia.g.alchemy.com/v2/lu5euUn39oCYOVFL8OCKN1GrRCtl-gwf",
      accounts: [
        "051e945cb866367e3dfaa8429fc704ec8793e11492c69e543a2800694c441ad7",
      ],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },

  etherscan: {
    apiKey: "5EV98J7WEJZF2YJADJ7AQHJ399VYU74YTG",
  },
};
