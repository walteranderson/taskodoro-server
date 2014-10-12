;(function () {
  'use strict';

  function LoginRoutes($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/components/account/login/login.html',
        controller: 'LoginCtrl'
      });
  }

  angular.module('taskodoro')
    .config(LoginRoutes);
}());
