require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.4.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
