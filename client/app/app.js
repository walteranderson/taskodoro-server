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
  })
  .run(function($rootScope, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {

        // if the next route requires authentication and we're logged out
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }

      });
    });
  });

}());
