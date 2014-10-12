;(function () {
  'use strict';

  angular.module('taskodoro', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router'
  ])
  .config(function($urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('authInterceptor');

    // $locationProvider.html5Mode(true);
  });

}());
