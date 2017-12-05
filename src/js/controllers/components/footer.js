const angular = require('angular')

angular.module('app').controller('FooterCtrl', function ($rootScope, $scope, $state) {
    var $ctrl = this

    $ctrl.repo = 'https://github.com/whitesunset/my_crypto_balance'
})