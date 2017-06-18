const angular = require('angular')

angular.module('app').controller('HeaderCtrl', function ($rootScope, $scope, $state) {
    var $ctrl = this

    $ctrl.storage = $rootScope.storage
    $ctrl.total = 0

    $scope.$on('ticker:update', function (e, data) {
        $ctrl.total = data['total']
    })

    $ctrl.getPercent = function (goal) {
        var percent = $ctrl.total * 100 / $ctrl.storage.settings[goal]
        percent = percent > 100 ? 100 : percent
        return percent.toFixed(2)
    }

    $ctrl.addCoin = function () {
        $scope.$emit('coin:add')
    }

    $ctrl.openSettings = function () {
        $scope.$emit('settings:open')
    }

    $ctrl.logout = function () {
        $rootScope.logged = false
        $rootScope.storage = null
        $state.go('/')
    }
})