;(function () {
  'use strict';

  function authInterceptor($window, $q, $location) {

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
          $location.path('/login');
          $window.sessionStorage.token = '';

          return $q.reject(res);
        }
      }
    };

  }//END authInterceptor

  angular.module('taskodoro')
    .factory('authInterceptor', authInterceptor);

}());
