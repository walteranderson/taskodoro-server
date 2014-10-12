;(function () {
  'use strict';

  function RegisterCtrl($scope, $location, Auth) {

    $scope.submit = function(user) {
      Auth.createUser(user)
        .then(function(data) {
          $location.path('/');
        })
        .catch(function(err) {
          console.log(err);
        });
    };

  }

  angular.module('taskodoro')
    .controller('RegisterCtrl', RegisterCtrl);
}());
