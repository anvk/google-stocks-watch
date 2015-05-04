/*global require*/

var GoogleStocksWatch = require('./lib/google-stocks-watch'),
    clear = require('clear'),
    googleStocksWatch;

var config = {
  timerInterval: 8,
  stocks: {
    'AAPL': {
      amount: '2',
      price: '130.10'
    },
    'GOOG': {
      amount: '10',
      price: '520.55'
    }
  }
};

googleStocksWatch = new GoogleStocksWatch(config, function(err, data) {
  clear();
  console.log(data);
});

googleStocksWatch.start();
