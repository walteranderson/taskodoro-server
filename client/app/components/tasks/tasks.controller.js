;(function () {
  'use strict';

  function TasksController($scope, $stateParams) {

    $scope.findAll = function() {
      $scope.tasks = ['task1', 'task2', 'task3'];
    };

    $scope.findOne = function() {
      $scope.id = $stateParams.id;
    };
  }

  angular.module('taskodoro')
    .controller('TasksController', TasksController);

}());
