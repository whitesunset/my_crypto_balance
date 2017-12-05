'use strict'

const angular = require('angular')
const tickerUpdate = 1000
const tickerInterval = 300000

const loadingMessages = [
  'WannaCrypt loading...',
  'Deleting wallet.dat...',
  'Order for 2 pizza has been placed...',
  'Pumping DOGE to the moon...',
  'Crushing world economy...',
  'Setting up mining rig...',
]

angular.module('app').controller('DashboardCtrl', [
  '$rootScope', '$scope', '$http', '$state', 'ModalService', '$storage', function ($rootScope, $scope, $http, $state, ModalService, $storage) {
    var $ctrl = this

    $ctrl.storage = $rootScope.storage

    if (!$rootScope.logged) {
      $state.go('/')
      return
    }

    $ctrl.saved = false
    $ctrl.ticker = []
    $ctrl.loaded = false

    $ctrl.storage = $rootScope.storage
    $ctrl.tickerCounter = tickerInterval

    $ctrl.updateCounter = function () {
      $ctrl.tickerCounter -= tickerUpdate
      $scope.$apply()
    }

    $scope.$on('ticker:update', function (e, data) {
      $ctrl.tickerCounter = tickerInterval
    })

    $ctrl.getCounter = function () {
      var secondsTotal = $ctrl.tickerCounter / 1000
      var minutes = secondsTotal / 60 < 1 ? 0 : Math.floor(secondsTotal / 60)
      var secondsLeft = secondsTotal - minutes * 60

      secondsLeft = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft

      return (minutes > 0 ? minutes + ':' : '') + secondsLeft
    }

    setInterval($ctrl.updateCounter, tickerUpdate)

    $scope.$watch('$ctrl.storage.coins', function () {
      $ctrl.sortCoins()
    }, true)

    $scope.$watch('$ctrl.storage.settings.currency', function () {
      $ctrl.updateTicker()
    }, true)

    $ctrl.addCoin = function () {
      ModalService.showModal({
        templateUrl: 'components/forms/coin.html',
        controller: "FormCoinCtrl",
        inputs: {
          coin: null
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (data) {
          if (data.coin) {
            $rootScope.storage.coins.push(data.coin)

            var total = $ctrl.getTotal($ctrl.storage.settings.currency)
            $scope.$broadcast('ticker:update', {
              total: total
            })

            $ctrl.save()
          }
        });
      });
    }

    $ctrl.saveSettings = function (mode) {
      $storage.set($ctrl.storage)

      $ctrl.saved = true
      setTimeout(function () {
        $ctrl.saved = false
        $('#settingsForm').modal('hide')
      }, 1000)
    }

    $ctrl.toggleChart = function (index) {
      var $container = jQuery('#chart_' + index)
      var $chart = jQuery('> div', $container).get(0)

      if ($chart) {
        $container.empty()
        $container.removeClass('visible')
      } else {
        $ctrl.initChart(index)
        $container.addClass('visible')
      }
    }

    $ctrl.save = function () {
      $storage.set($ctrl.storage)
    }

    $ctrl.editCoin = function ($index) {
      ModalService.showModal({
        templateUrl: 'components/forms/coin.html',
        controller: "FormCoinCtrl",
        inputs: {
          coin: angular.copy($ctrl.storage.coins[$index])
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (data) {
          $ctrl.storage.coins[$index] = data.coin

          var total = $ctrl.getTotal($ctrl.storage.settings.currency)
          $scope.$broadcast('ticker:update', {
            total: total
          })

          $ctrl.save()
        });
      });

    }

    $ctrl.removeCoin = function ($index) {
      $ctrl.storage.coins.splice($index, 1)
      $ctrl.save()
    }

    $ctrl.price = function (symbol, currency) {
      if ($ctrl.ticker.length === 0) return 0

      var coin = $ctrl.storage.coins.find(function (item) {
        return item.symbol == symbol
      })
      var ticker = $ctrl.ticker.find(function (item) {
        return item.symbol == coin.symbol
      })

      if (!ticker) return 0

      var result = ticker['price_' + currency.toLowerCase()]

      return parseFloat(+result).toFixed(8)
    }

    $ctrl.getDifference = function (coin) {
      var price = $ctrl.price(coin.symbol, 'btc')
      var difference = parseFloat(100 * +price / coin.bought_price - 100).toFixed(2)
      return difference
    }

    $ctrl.sum = function (index, currency) {
      if ($ctrl.ticker.length === 0) return 0

      var accuracy = currency == 'btc' ? 8 : 2
      var coin = $ctrl.storage.coins[index]
      var ticker = $ctrl.ticker.find(function (item) {
        return item.symbol == coin.symbol
      })

      if (!ticker) return 0

      var result = +coin.amount * +ticker['price_' + currency.toLowerCase()]

      return isNaN(result) ? '' : +result.toFixed(accuracy).toString()
    }

    $ctrl.getTotal = function (currency) {
      var total = 0
      $ctrl.storage.coins.forEach(function (coin, i, arr) {
        total += +$ctrl.sum(i, currency)
      })
      return total.toFixed(2)
    }

    $ctrl.sortCoins = function () {
      if ($ctrl.ticker.length === 0) return

      $ctrl.storage.coins.sort(function (a, b) {
        var tickerA = $ctrl.ticker.find(function (item) {
          return item.symbol == a.symbol
        })
        var tickerB = $ctrl.ticker.find(function (item) {
          return item.symbol == b.symbol
        })
        return (+b.amount * +tickerB['price_btc']) - (+a.amount * +tickerA['price_btc'])
      })

      $ctrl.storage.coins.forEach(function (coin, i, arr) {
        var ticker = $ctrl.ticker.find(function (item) {
          return item.symbol == coin.symbol
        })
        coin.id = ticker.id
      })
    }

    $ctrl.updateTicker = function () {
      $http.get('https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=' + $ctrl.storage.settings.currency)
        .then(function (response) {
          $ctrl.ticker = response.data
          $ctrl.loaded = true
          $ctrl.sortCoins()

          var total = $ctrl.getTotal($ctrl.storage.settings.currency)
          $scope.$broadcast('ticker:update', {
            total: total
          })
        })
        .catch(function (e) {

        })
    }

    $ctrl.initChart = function (index) {
      var coin = $ctrl.storage.coins[index]
      var symbol = coin.symbol == 'BTC' ? "BTCUSDT" : coin.symbol + "BTC"

      new TradingView.widget({
        "container_id": "chart_" + index,
        "autosize": true,
        "symbol": "POLONIEX:" + symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "White",
        "style": "1",
        "locale": "ru",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "hideideas": true
      });
    }

    $ctrl.getChange = function (symbol) {
      if ($ctrl.ticker.length === 0) return true

      var ticker = $ctrl.ticker.find(function (item) {
        return item.symbol == symbol
      })

      if (!ticker) return false

      return +ticker['percent_change_1h'] > 0 ? true : false
    }

    $scope.$on('coin:add', $ctrl.addCoin)

    $scope.$on('settings:open', function (e, data) {
      ModalService.showModal({
        templateUrl: 'components/forms/settings.html',
        controller: "FormSettingsCtrl",
        inputs: {
          settings: angular.copy($ctrl.storage.settings)
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (data) {
          $rootScope.storage.settings = data
          $ctrl.save()
        });
      });
    })

    var index = Math.floor(Math.random() * loadingMessages.length)
    $ctrl.loadingMessage = loadingMessages[index]

    $ctrl.updateTicker()
    setInterval($ctrl.updateTicker, tickerInterval)
  }])