const angular = require('angular')

angular.module('app').controller('LoginCtrl', function ($rootScope, $scope, $state, $storage) {
    var $ctrl = this

    $ctrl.passphrase = ''

    $ctrl.login = function() {
        $rootScope.logged = true
        $rootScope.storage = $storage.get($ctrl.passphrase)
        $state.go('dashboard')
    }
})