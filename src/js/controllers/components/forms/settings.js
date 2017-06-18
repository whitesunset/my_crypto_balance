const angular = require('angular')
const prefix = 'crypto_balance_'
const CryptoJS = require("crypto-js")

angular.module('app').controller('FormSettingsCtrl', function ($scope, settings, close) {
    var defaults = {
        goal: true,
        goal_limit: 100000,
        subgoal: false,
        subgoal_limit: 10000,
        currency: 'USD'
    }

    $scope.settings = settings || defaults

    $scope.currencies = [
        "AUD", "BRL", "CAD", "CHF", "CNY", "EUR", "GBP", "HKD", "IDR", "INR", "JPY", "KRW", "MXN", "RUB", "USD"
    ]

    $scope.save = function () {
        close(angular.copy($scope.settings), 500)
    }
})