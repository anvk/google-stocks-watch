'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _googleStocks = require('google-stocks');

var _googleStocks2 = _interopRequireDefault(_googleStocks);

var GoogleStocksWatch = (function () {
  function GoogleStocksWatch(options, callback) {
    if (options === undefined) options = {};

    _classCallCheck(this, GoogleStocksWatch);

    var _options$stocks = options.stocks;
    var stocks = _options$stocks === undefined ? {} : _options$stocks;
    var _options$timerInterval = options.timerInterval;
    var timerInterval = _options$timerInterval === undefined ? 10000 : _options$timerInterval;

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

  _createClass(GoogleStocksWatch, [{
    key: '_process',
    value: function _process() {
      var _this = this;

      var data = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var result = [];

      // cannot use for...of loop since it is supported only in Node > 0.12
      data.forEach(function (dataObj) {
        return result.push(_this._onParse(dataObj));
      });

      return result;
    }
  }, {
    key: '_tick',
    value: function _tick() {
      var _this2 = this;

      (0, _googleStocks2['default'])(this._stockCodes, function (error, data) {
        if (error) {
          return _this2._callback(error);
        }

        _this2._callback(undefined, _this2._process(data));
      });
    }
  }, {
    key: '_onParse',
    value: function _onParse() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var code = options.t;
      var currentPrice = options.l;
      var current_time = options.lt;

      var _ref = this._stocks[code] || {};

      var stockAmount = _ref.amount;
      var initialPrice = _ref.price;

      var currentTotalPrice = currentPrice * stockAmount;
      var purchasedTotalPrice = stockAmount * initialPrice;
      var difference = currentTotalPrice - purchasedTotalPrice;

      var percentage = (difference / purchasedTotalPrice * 100).toFixed(2);

      return {
        code: code,
        amount: stockAmount,
        current_time: current_time,
        current_price: currentPrice,
        current_total_price: currentTotalPrice.toFixed(2),
        purchased_price: initialPrice,
        purchased_total_price: purchasedTotalPrice.toFixed(2),
        diff: difference.toFixed(2),
        percentage: percentage + '%'
      };
    }
  }, {
    key: 'start',
    value: function start() {
      if (this._interval) {
        return;
      }

      this._tick();
      this._interval = setInterval(this._tick, this._timerInterval);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!this._interval) {
        return;
      }

      clearInterval(this._interval);
    }
  }, {
    key: 'stocks',
    get: function get() {
      return this._stocks;
    }
  }]);

  return GoogleStocksWatch;
})();

exports['default'] = GoogleStocksWatch;
module.exports = exports['default'];