;(function () {
  'use strict';

  angular.module('taskodoro', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'snap'
  ])
  .config(function($urlRouterProvider, $locationProvider, $httpProvider, snapRemoteProvider) {
    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('authInterceptor');

    $locationProvider.html5Mode(true);

    snapRemoteProvider.globalOptions = {
      disable: 'right',
      // touchToDrag: false
    };
  })

  // Login check for each state change
  .run(function($rootScope, $location, snapRemote, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, next) {

      // close the side nav if we navigate to a new page
      snapRemote.close('nav-content');

      Auth.isLoggedInAsync(function(loggedIn) {

        // if the next route requires authentication and we're logged out
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }

      });
    });
  });

}());
