;(function () {
  'use strict';

  function LoginCtrl($scope, Auth) {
    $scope.submit = function(user) {
      Auth.login(user)
        .then(function(data) {
          console.log('success!');
          console.log(data);
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
