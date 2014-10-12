;(function () {
  'use strict';

  function LoginCtrl($scope) {
    $scope.submit = function(user) {
      console.log('received user data');
      console.log(user);
    }
  }

  angular.module('taskodoro')
    .controller('LoginCtrl', LoginCtrl);
}());
