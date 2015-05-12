# google-stocks-watch [![Build Status](https://travis-ci.org/anvk/google-stocks-watch.svg?branch=master)](https://travis-ci.org/anvk/google-stocks-watch)

> Stock ticker to pull the latest stock data and calculate gain or loss based on the purchase. Based on [google-stocks NPM](https://github.com/anvk/google-stocks)


## Install

```
$ npm install --save google-stocks-watch
```


## Usage

```js
var GoogleStocksWatch = require('google-stocks-watch'),
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
```

returned format looks like this:

```js
/**
[ { code: 'AAPL',
    amount: '2',
    current_time: 'May 4, 4:47PM EDT',
    current_price: '128.77',
    current_total_price: '257.54',
    purchased_price: '130.10',
    purchased_total_price: '260.20',
    diff: '-2.66',
    percentage: '-1.02%' },
  { code: 'GOOG',
    amount: '10',
    current_time: 'May 4, 4:46PM EDT',
    current_price: '540.97',
    current_total_price: '5409.70',
    purchased_price: '520.55',
    purchased_total_price: '5205.50',
    diff: '204.20',
    percentage: '3.92%' } ]
**/
```

## License

MIT license; see [LICENSE](./LICENSE).

(c) 2015 by Alexey Novak
