/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'address mammal skirt screen squeeze armor noble mother junior now core olympic';
new HDWalletProvider(mnemonic,'https://rinkeby.infura.io/v3/1daba21cfd7a4d9a8773600e943db915');
 module.exports = {
   // See <http://truffleframework.com/docs/advanced/configuration>
   // to customize your Truffle configuration!
   solc: {
     optimizer: {
       enabled: true,
       runs: 200
     }
   },
   networks: {
     development: {
       host: "localhost",
       port: 7545,
       network_id: "5777"
     },
     rinkeby:  {

      network_id: 4,
      provider :  function() {
         return new HDWalletProvider(mnemonic,'https://rinkeby.infura.io/v3/1daba21cfd7a4d9a8773600e943db915');
       },
     gas: 2900000
    }
   }//https://ropsten.infura.io/v3/1daba21cfd7a4d9a8773600e943db915
 };
