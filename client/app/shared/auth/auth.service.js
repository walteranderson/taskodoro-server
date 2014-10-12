;(function () {
  'use strict';

  function Auth($window, $http, $q, User) {
    var currentUser = {};
    if ($window.sessionStorage.token) {
      currentUser = User.get();
    }

    return {

      login: function(user) {
        var deferred = $q.defer();

        $http.post('/auth/local', {
          username: user.username,
          password: user.password
        })
        .success(function(data) {
          $window.sessionStorage.token = data.token;
          currentUser = User.get();

          deferred.resolve(data);
        })
        .error(function(err) {
          this.logout();
          deferred.reject(err);
        }.bind(this));

        return deferred.promise;
      },

      logout: function() {
        $window.sessionStorage.token = '';
        currentUser = {};
      },

      getCurrentUser: function() {
        return currentUser;
      },

      isLoggedIn: function() {
        return currentUser.hasOwnProperty('_id');
      }
    };

  }//END Auth

  angular.module('taskodoro')
    .factory('Auth', Auth);

}());
