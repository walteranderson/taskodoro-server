;(function () {
  'use strict';

  angular.module('taskodoro', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    // $locationProvider.html5Mode(true);
  });

}());
