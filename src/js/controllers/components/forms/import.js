const angular = require('angular')

angular.module('app').controller('FormImportCtrl', function ($scope, $storage, close) {
    $scope.string = ''

    $scope.import = function () {
        close($scope.string, 500)
    }
})