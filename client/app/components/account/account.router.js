;(function () {
  'use strict';

  function AccountRouter($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/components/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/components/account/register/register.html',
        controller: 'RegisterCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/components/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  }

  angular.module('taskodoro')
    .config(AccountRouter);

}());
