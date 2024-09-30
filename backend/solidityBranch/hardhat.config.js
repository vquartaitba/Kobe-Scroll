require("@nomicfoundation/hardhat-toolbox");
const PRIVATE_KEY = "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    zkEVM: {
      url: `https://rpc.cardona.zkevm-rpc.com`,
      accounts: [PRIVATE_KEY],
    },
    avax: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [PRIVATE_KEY],
    },
    scroll: {
      url: "https://scroll-sepolia.g.alchemy.com/v2/",
      accounts: [PRIVATE_KEY],
    },
  },
};
