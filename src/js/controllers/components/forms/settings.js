const angular = require('angular')

angular.module('app').controller('FormSettingsCtrl', function ($scope, $storage, settings, close) {
    var defaults = {
        goal: true,
        goal_limit: 100000,
        subgoal: false,
        subgoal_limit: 10000,
        currency: 'USD'
    }

    $scope.currencies = [
        "AUD", "BRL", "CAD", "CHF", "CNY", "EUR", "GBP", "HKD", "IDR", "INR", "JPY", "KRW", "MXN", "RUB", "USD"
    ]

    $scope.settings = settings || defaults

    $scope.export = function () {
        return $storage.export()
    }

    $scope.save = function () {
        close(angular.copy($scope.settings), 500)
    }
})