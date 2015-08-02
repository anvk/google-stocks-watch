'use strict';

/* global require */

var GoogleStocksWatch = require('./dist/google-stocks-watch'),
    clear = require('clear'),
    googleStocksWatch,
    index = 0;

var config = {
  timerInterval: 4000, // milliseconds
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
  index = index + 1;
  console.log('#%d iteration', index);
  console.log(data);
});

googleStocksWatch.start();
