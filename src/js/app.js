App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,
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
                  console.log(CashFinex);
                });
                App.listenForEvents();
                return App.render();
          });

    })
  },
  listenForEvents: function() {
    App.contracts.DappTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },


  render: function() {
    if(App.loading){
      return;
    }
    App.loading = true;
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();
    web3.eth.getCoinbase(function(err, account){
      if(err === null ){
        App.account = account;
        console.log("Account=" +  account);
        $('#accountAddress').html("Your Account:"+ account);
      }
    })

    App.contracts.DappTokenSale.deployed().then(function(instance){
        dappTokenSaleIntance = instance;
        console.log(dappTokenSaleIntance);
        return dappTokenSaleIntance.tokenPrice();
    }).then(function(tokenPrice){
          App.tokenPrice = tokenPrice;
          $('.tokenPrice').html(web3.fromWei(tokenPrice,'ether').toNumber());

          return dappTokenSaleIntance.tokensSold();
    }).then(function(tokensSold){
          App.tokensSold = tokensSold.toNumber();
          $('.tokens-sold').html(App.tokensSold);
          $('.tokens-available').html(App.tokensAvailable);

          var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
          $('#progress').css('width', progressPercent, '%');

          App.contracts.CashFinex.deployed().then(function(instance){
              CashFinex = instance;
              return CashFinex.name();
            }).then(function(name){
              $('.tokenName').html(name);
              return CashFinex.symbol();
            }).then(function(symbol){
              $('.tokenSymbol').html(symbol);
              return CashFinex.balanceOf(App.account);
          }).then(function(balance){
                bal = balance.toNumber();
                $('.dapp-balance').html(bal);
                App.loading = false;
                loader.hide();
                content.show();
          });

    });

    },

    buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfToken').val();
    App.contracts.DappTokenSale.deployed().then(function(instance) {
      console.log("token="+ numberOfTokens);
      console.log(App.account);
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Sell event
    });
  }
};

$(function(){
  $(window).on('load', function(){
        App.init();
    });
});
