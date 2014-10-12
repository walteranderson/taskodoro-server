;(function () {
  'use strict';

  function MainCtrl($scope, Auth) {
    $scope.text = 'Hey look I work!';

    $scope.user = Auth.getCurrentUser();
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
