require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY ="3U3n7zoDwjIVJHqlpYboHfxi_QaP-P87";
const SEPOLIA_PRIVATE_KEY = "2aa9c6e1ef6bd527ca9c80b492eb9725ebada2730387e5fb213cdd7bc18b0440";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: "ZSTZJR9CJEQ1NIGQRX2IQ7WSQIKM7ZBRMP",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
