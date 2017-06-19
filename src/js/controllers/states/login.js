const angular = require('angular')

angular.module('app').controller('LoginCtrl', function ($rootScope, $scope, $state, $storage, ModalService) {
    var $ctrl = this

    $ctrl.passphrase = ''
    $ctrl.exportString = 'Export'

    $ctrl.login = function() {
        $rootScope.logged = true
        $rootScope.storage = $storage.get($ctrl.passphrase)
        $state.go('dashboard')
    }
    
    $ctrl.openImport = function () {
        ModalService.showModal({
            templateUrl: 'components/forms/import.html',
            controller: "FormImportCtrl",
            inputs: {
                coin: null
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (data) {
                var result = $storage.import(data)

                if(result){
                    $ctrl.exportString = 'Success. You can enter with your passphrase now.'
                    setTimeout(function () {
                        $ctrl.exportString = 'Export'
                        $scope.$apply()
                    }, 4000)
                }else{
                    $ctrl.exportString = 'Fail. Storage already exists'
                    setTimeout(function () {
                        $ctrl.exportString = 'Export'
                        $scope.$apply()
                    }, 4000)
                }
            });
        });
    }
})