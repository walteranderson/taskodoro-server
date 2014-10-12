;(function () {
  'use strict';

  angular.module('taskodoro', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router'
  ])
  .config(function($locationProvider) {
    // $locationProvider.html5Mode(true);
  });

}());
