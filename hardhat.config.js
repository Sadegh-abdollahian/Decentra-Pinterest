require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
const GANACHE_PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [GANACHE_PRIVATE_KEY],
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_APIKEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      11155111: 0,
    },
  }
};
