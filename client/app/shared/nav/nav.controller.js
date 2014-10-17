;(function () {
  'use strict';

  function NavCtrl($scope, $location, snapRemote, Auth) {
    $scope.title = 'Taskodoro';
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.getCurrentUser;

    $scope.toggleNav = function() {
      snapRemote.toggle('left', 'nav-content');
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };
  }

  angular.module('taskodoro')
    .controller('NavCtrl', NavCtrl);
}());
