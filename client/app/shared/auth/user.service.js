;(function () {
  'use strict';

  function User($resource) {
    return $resource('/api/users/:id/:controller', null, {
      changePassword: {
        method: 'PUT',
        params: { controller:'password' }
      },
      get: {
        method: 'GET',
        params: { id:'me' }
      }
    });
  }

  angular.module('taskodoro')
    .factory('User', User);

}());
