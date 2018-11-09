var CashFinex = artifacts.require("./CashFinex.sol");
var DappTokenSale = artifacts.require("./DappTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(CashFinex, 1000000).then(function(){
    var tokenPrice = 1000000000000000;
    return deployer.deploy(DappTokenSale, CashFinex.addres,tokenPrice);
  });


};
