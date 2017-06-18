'use strict'

const angular = require('angular')

angular.module('app').service('$math', function ($rootScope) {
    this.sum = function (symbol, currency) {
        if ($ctrl.ticker.length === 0) return 0

        var accuracy = currency == 'btc' ? 8 : 2
        var coin = $ctrl.storage.coins.find(function (item) {
            return item.symbol == symbol
        })
        var ticker = $ctrl.ticker.find(function (item) {
            return item.symbol == coin.symbol
        })

        if (!ticker) return 0

        var result = +coin.amount * +ticker['price_' + currency.toLowerCase()]

        return isNaN(result) ? '' : +result.toFixed(accuracy).toString()
    }

    this.getTotal = function (currency) {
        var total = 0
        $rootScope.storage.coins.forEach(function (coin, i, arr) {
            total += +$ctrl.sum(coin.symbol, currency)
        })
        return total.toFixed(2)
    }
})

