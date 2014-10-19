;(function () {
  'use strict';

  function MainCtrl($scope, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
