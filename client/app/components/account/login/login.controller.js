;(function () {
  'use strict';

  function LoginCtrl($scope, $location, Auth) {
    $scope.submit = function(user) {
      Auth.login(user)
        .then(function(data) {
          $location.path('/');
        })
        .catch(function(err) {
          console.log('error!');
          console.log(err);
        });
    };
  }

  angular.module('taskodoro')
    .controller('LoginCtrl', LoginCtrl);
}());
