require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY ="jpYh7W8QJ144MENpDQh7Tyg0jw-kzRah-P87";
const SEPOLIA_PRIVATE_KEY = "eaff766162269d838cdbc1959698b7bc38185c7f6dedab40a0c1edb0d39d1bbf";

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
