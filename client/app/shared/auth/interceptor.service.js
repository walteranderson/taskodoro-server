;(function () {
  'use strict';

  function authInterceptor($window, $q) {

    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }

        return config;
      },
      responseError: function(res) {
        if (res.status === 401) {
          // $state.go('login');
          $window.sessionStorage.token = '';

          return $q.reject(res);
        }
      }
    };

  }//END authInterceptor

  angular.module('taskodoro')
    .factory('authInterceptor', authInterceptor);

}());
