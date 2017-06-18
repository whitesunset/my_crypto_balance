const angular = require('angular')

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    var loginState = {
        name: '/',
        url: '/',
        templateUrl: 'login.html',
    }

    var dashboardState = {
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: 'dashboard.html'
    }

    $stateProvider.state(loginState)
    $stateProvider.state(dashboardState)

    $urlRouterProvider.otherwise('/')

}).run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.logged = false
})