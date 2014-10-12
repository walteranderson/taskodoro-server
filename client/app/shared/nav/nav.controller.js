;(function () {
  'use strict';

  function NavCtrl($scope, $location, Auth) {
    $scope.title = 'Taskodoro';
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    }
  }

  angular.module('taskodoro')
    .controller('NavCtrl', NavCtrl);
}());
