const HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "mountains supernatural bird..."; // 12 word mnemonic

module.exports = {
  networks: {
    main: {
      provider: () => new HDWalletProvider(mnemonic, "https://mainnet.infura.io/"),
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    compilers: {
      solc: {
        version: "0.5.0",
      }
    },
  }
};
