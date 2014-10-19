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

    // located in shared/auth/interceptor.service.js
    $httpProvider.interceptors.push('authInterceptor');

    // use html5 push state
    $locationProvider.html5Mode(true);

    // snap.js global options
    snapRemoteProvider.globalOptions = {
      disable: 'right',
      // touchToDrag: false
    };
  })

  // Login check for each state change
  .run(function($rootScope, $location, snapRemote, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, next) {

      // close the side nav if we navigate to a new page
      snapRemote.close('container');

      Auth.isLoggedInAsync(function(loggedIn) {

        // if the next route requires authentication and we're logged out
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }

      });
    });
  });

}());
