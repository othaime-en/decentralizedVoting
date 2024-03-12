require("@matterlabs/hardhat-zksync-solc");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  defaultNetwork: "sepolia",
  networks: {
    zksync_testnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      chainId: 280,
      zksync: true,
    },
    zksync_mainnet: {
      url: "https://zksync2-mainnet.zksync.io/",
      ethNetwork: "mainnet",
      chainId: 324,
      zksync: true,
    },
    hardhat: {
      // Configuration for the local Hardhat node
      chainId: 1337, // Replace with the chain ID of your local Hardhat network
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
