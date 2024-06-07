require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/bzTkUq6lhxEjhpwe4qIk7hUqPBc2ZD4p',
      accounts: ['6577b5b235f06daf5089e41808d3d60e8073d363a0252efc8e5aaa29c93e4067']
    }
  }
};
