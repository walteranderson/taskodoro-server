;(function () {
  'use strict';

  function MainCtrl($scope, Auth) {
    $scope.user = Auth.getCurrentUser();
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
