'use strict';

/*global require, module*/

var googleStocks = require('google-stocks');

// timerInterval
// stocks
var GoogleStocksWatch = function(options, callback) {
  this._tick = this._tick.bind(this);
  this._process = this._process.bind(this);
  this.onParse = this.onParse.bind(this);
  this.start = this.start.bind(this);
  this.stop = this.stop.bind(this);

  options = options || {};

  var defaultTimerInterval = 10;

  this.stocks = options.stocks || {};
  this._callback = callback;
  this._timerInterval = options.timerInterval || defaultTimerInterval;
  this._stockCodes = Object.keys(this.stocks);
  this._interval = undefined;
};

GoogleStocksWatch.prototype._process = function(data) {
  var result = [];

  for(var i=0, len = data.length; i < len; ++i) {
    result.push(this.onParse(data[i]));
  }

  return result;
};

GoogleStocksWatch.prototype._tick = function() {
  googleStocks.get(this._stockCodes, function(error, data) {
    if (error) {
      this._callback(error);
      return;
    }

    data = this._process(data);

    this._callback(null, data);
  }.bind(this));
};

GoogleStocksWatch.prototype.onParse = function(stock) {
  var s = this.stocks[stock.t] || {},
      currentTotalPrice = stock.l * s.amount,
      purchasedTotalPrice = s.amount * s.price,
      difference = currentTotalPrice - purchasedTotalPrice;

  return {
    code: stock.t,
    amount: s.amount,
    current_time: stock.lt,
    current_price: stock.l,
    current_total_price: currentTotalPrice.toFixed(2),
    purchased_price: s.price,
    purchased_total_price: purchasedTotalPrice.toFixed(2),
    diff: difference.toFixed(2),
    percentage: ((difference / purchasedTotalPrice) * 100).toFixed(2) + '%'
  };
};

GoogleStocksWatch.prototype.start = function() {
  if (this._interval) {
    return;
  }

  this._tick();
  this._interval = setInterval(this._tick, this._timerInterval * 1000);
};

GoogleStocksWatch.prototype.stop = function() {
  if (!this._interval) {
    return;
  }

  clearInterval(this._interval);
};

module.exports = GoogleStocksWatch;
