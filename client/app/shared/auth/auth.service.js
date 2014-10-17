;(function () {
  'use strict';

  function Auth($window, $http, $q, User) {
    var currentUser = null;
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
        currentUser = null;
      },

      createUser: function(user) {
        return User.save(user,
          function(data) {
            console.log('all is well!');
            $window.sessionStorage.token = data.token;
            currentUser = User.get();
          }, function(err) {
            this.logout();
          }.bind(this)).$promise;
      },

      getCurrentUser: function() {
        return currentUser;
      },

      isLoggedIn: function() {
        return currentUser.hasOwnProperty('_id');
      },

      isLoggedInAsync: function(cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          // check the promise and return boolean
          currentUser.$promise.then(function() {
            cb(true);
          })
          .catch(function() {
            cb(false);
          });

        } else if (currentUser.hasOwnProperty('_id')) {
          // user exists and is logged in
          cb(true);
        } else {
          // user not logged in
          cb(false);
        }
      },

      changePassword: function(oldPassword, newPassword) {
        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }).$promise;
      }
    };

  }//END Auth

  angular.module('taskodoro')
    .factory('Auth', Auth);

}());
