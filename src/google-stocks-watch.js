'use strict';

import googleStocks from 'google-stocks';

export default class GoogleStocksWatch {

  constructor({stocks = {}, timerInterval = 10000} = {}, callback) {
    if (!callback) {
      throw 'google-stocks-watch: callback is not passed';
    }

    this._tick = this._tick.bind(this);
    this._process = this._process.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    this._onParse = this._onParse.bind(this);
    this._stocks = stocks;
    this._timerInterval = timerInterval;
    this._callback = callback;
    this._stockCodes = Object.keys(this._stocks);
    this._interval = undefined;
  }

  _process(data = []) {
    let result = [];

    // cannot use for...of loop since it is supported only in Node > 0.12
    data.forEach(dataObj => {
      result.push(this._onParse(dataObj));
    });

    return result;
  }

  _tick() {
    googleStocks.get(this._stockCodes, (error, data) => {
      if (error) {
        return this._callback(error);
      }

      data = this._process(data);

      this._callback(undefined, data);
    });
  }

  _onParse({t: stockCode, l: currentPrice, lt: currentTime} = {}) {
    let {amount: stockAmount, price: initialPrice} = this._stocks[stockCode] || {},
        currentTotalPrice = currentPrice * stockAmount,
        purchasedTotalPrice = stockAmount * initialPrice,
        difference = currentTotalPrice - purchasedTotalPrice;

    return {
      code: stockCode,
      amount: stockAmount,
      current_time: currentTime,
      current_price: currentPrice,
      current_total_price: currentTotalPrice.toFixed(2),
      purchased_price: initialPrice,
      purchased_total_price: purchasedTotalPrice.toFixed(2),
      diff: difference.toFixed(2),
      percentage: ((difference / purchasedTotalPrice) * 100).toFixed(2) + '%'
    };
  }

  get stocks() {
    return this._stocks;
  }

  start() {
    if (this._interval) {
      return;
    }

    this._tick();
    this._interval = setInterval(this._tick, this._timerInterval);
  }

  stop() {
    if (!this._interval) {
      return;
    }

    clearInterval(this._interval);
  }
};
