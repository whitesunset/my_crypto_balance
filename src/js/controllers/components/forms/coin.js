const angular = require('angular')

angular.module('app').controller('FormCoinCtrl', function ($scope, coin, close) {
    $scope.mode = 'add'

    $scope.notes = [
        'BTC-E',
        'Bittrex',
        'Poloniex',
        'Hashflare',
        'Desktop wallet',
        'Online wallet',
        'Paper wallet',
        'Custom note'
    ]

    $scope.coin = coin || {
        symbol: '',
        amount: '',
        id: '',
        note: ''
    }
    
    $scope.save = function () {
        // Force uppercase for symbol
        $scope.coin.symbol = $scope.coin.symbol.toUpperCase()

        close({
            mode: 'add',
            coin: angular.copy($scope.coin)
        }, 500)
    }

    $scope.valid = function () {
        return $scope.coin.symbol != '' && $scope.coin.amount != '' && $scope.coin.symbol.length > 1
    }
})