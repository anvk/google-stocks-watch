# google-stocks-watch [![Build Status](https://travis-ci.org/anvk/google-stocks-watch.svg?branch=master)](https://travis-ci.org/anvk/google-stocks-watch)

> Stock ticker to pull the latest stock data and calculate gain or loss based on the purchase. Based on [google-stocks NPM](https://github.com/anvk/google-stocks)


## Install

```
$ npm install google-stocks-watch --save
```

## API

#### GoogleStocksWatch(options, callback)

> constructor to initialize Google Stocks Watch

> `options` - options for the module  
> `options.timerInterval` - (optional) how often ticker callback will be executed (in milliseconds) (default 10000)  
> `options.stocks` - object containing initial stock purchase  
> `stock.amount` - amount of purchased stocks  
> `stock.price` - initial price  
> `callback` - function callback to be executed every `timerInterval` milliseconds. Has 2 arguments: `error` and `data`  


#### start()

> function to start time ticker

#### stop()

> function to stop time ticker

#### stocks

> property which contains initial `stocks` object

## Usage

```js
var GoogleStocksWatch = require('google-stocks-watch'),
    googleStocksWatch;

var config = {
  timerInterval: 8000, // milliseconds
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

## Example

```
npm run example
```

## License

MIT license; see [LICENSE](./LICENSE).
