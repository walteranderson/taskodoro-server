;(function () {
  'use strict';

  function MainRouter($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/components/main/main.html',
        controller: 'MainCtrl'
      });
  }

  angular.module('taskodoro')
    .config(MainRouter);
}());
