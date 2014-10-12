;(function () {
  'use strict';

  function MainRoutes($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/components/main/main.html',
        controller: 'MainCtrl'
      });
  }

  angular.module('taskodoro')
    .config(MainRoutes);
}());
