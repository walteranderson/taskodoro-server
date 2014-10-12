;(function () {
  'use strict';

  function MainRoutes($stateProvider) {
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
