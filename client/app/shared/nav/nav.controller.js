;(function () {
  'use strict';

  function NavCtrl($scope) {
    $scope.title = 'Taskodoro';
  }

  angular.module('taskodoro')
    .controller('NavCtrl', NavCtrl);
}());
