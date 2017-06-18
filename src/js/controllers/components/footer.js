const angular = require('angular')
const tickerUpdate = 1000
const tickerInterval = 300000

angular.module('app').controller('FooterCtrl', function ($rootScope, $scope, $state) {
    var $ctrl = this

    $ctrl.repo = 'https://github.com/whitesunset/my_crypto_balance'
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
})