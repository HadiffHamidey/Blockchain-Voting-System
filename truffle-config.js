const path = require("path");
//const HDWalletProvider = require('@truffle/hdwallet-provider');
//const { SocketAddress } = require("net");
//const seed_phrase = ""
//const address = "0xBB1c9bAc509Cf2cae270911b1aA1448028C0d2BD"
//const infura_rinkeby_link = ""

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      network_id: "*",
      host: "localhost",
      // port: 7545, // for ganache gui
      port: 7545, // 8545: for ganache-cli
      gas: 6721975,
      gasPrice: 20000000000,
    },
  },
};

/*
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {

    development: {
      network_id: "*",
      host: "localhost",
      port: 7545, // 8545: for ganache-cli , 7545: for ganache-gui
    },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    rinkeby: {
      networkCheckTimeout: 10000, 
       provider: () => new HDWalletProvider(seed_phrase, infura_rinkeby_link),
       network_id: 4,       // Rinkeby's id
       gas: 5500000,        // Ropsten has a lower block limit than mainnet
       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       from: address,
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }

  }
};
*/
