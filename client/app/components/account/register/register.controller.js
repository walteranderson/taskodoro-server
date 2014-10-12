;(function () {
  'use strict';

  function RegisterCtrl($scope) {
    $scope.submit = function(user) {
      console.log('received user');
      console.log(user);
    };
  }

  angular.module('taskodoro')
    .controller('RegisterCtrl', RegisterCtrl);
}());
