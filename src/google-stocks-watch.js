import googleStocks from 'google-stocks';

export default class GoogleStocksWatch {

  constructor(options = {}, callback) {
    const {
      stocks = {},
      timerInterval = 10000
    } = options;

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
    data.forEach(dataObj => result.push(this._onParse(dataObj)));

    return result;
  }

  _tick() {
    googleStocks(this._stockCodes, (error, data) => {
      if (error) {
        return this._callback(error);
      }

      this._callback(undefined, this._process(data));
    });
  }

  _onParse(options = {}) {
    const {
      t: code,
      l: currentPrice,
      lt: current_time
    } = options;

    const {
      amount: stockAmount,
      price: initialPrice
    } = this._stocks[code] || {};

    const currentTotalPrice = currentPrice * stockAmount;
    const purchasedTotalPrice = stockAmount * initialPrice;
    const difference = currentTotalPrice - purchasedTotalPrice;

    const percentage = ((difference / purchasedTotalPrice) * 100).toFixed(2);

    return {
      code,
      amount: stockAmount,
      current_time,
      current_price: currentPrice,
      current_total_price: currentTotalPrice.toFixed(2),
      purchased_price: initialPrice,
      purchased_total_price: purchasedTotalPrice.toFixed(2),
      diff: difference.toFixed(2),
      percentage: `${percentage}%`
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
}
