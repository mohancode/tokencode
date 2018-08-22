App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    init: function() {
        console.log("initialized....")
        return App.initWeb3();
    },
    initWeb3: function(){
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            // set the provider you want from Web3.providers
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
            web3 = new Web3(App.web3Provider);
          }

          return App.initContracts();
    },
    initContracts: function() {
      $.getJSON('DappTokenSale.json',function(dappTokenSale) {

          App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
          App.contracts.DappTokenSale.setProvider(App.web3Provider);
          App.contracts.DappTokenSale.deployed().then(function(dappTokenSale){
            console.log("DappTokenAddress", dappTokenSale.address);
          });
        }).done(function(){
              $.getJSON('CashFinex.json',function(CashFinex) {
                App.contracts.CashFinex = TruffleContract(CashFinex);
                App.contracts.CashFinex.setProvider(App.web3Provider);
                App.contracts.CashFinex.deployed().then(function(CashFinex){
                  console.log("TokenAddress", CashFinex.address);
                });
                return App.render();
          });

    })
  },

  render: function() {
    web3.eth.getCoinbase(function(err, account){
      if(err === null ){
        App.account = account;
        console.log("Account=" +  account);
        $('#accountAddress').html("Your Account:"+ account);
      }
    });
  }
};

$(function(){
  $(window).on('load', function(){
        App.init();
    });
});
