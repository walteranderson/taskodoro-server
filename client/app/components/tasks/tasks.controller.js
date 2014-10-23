;(function () {
  'use strict';

  function TasksController($scope, $stateParams, $location, Task) {

    $scope.findAll = function() {
      $scope.tasks = Task.query();
    };

    $scope.findOne = function() {
      $scope.task = Task.get({ id: $stateParams.id });
    };

    $scope.update = function() {
      var task = $scope.task;

      task.$update(function() {
        $location.path('/tasks');
      }, function(err) {
        console.log(err);
      });
    };

    $scope.addTask = function(newTask) {
      var task = new Task({
        name: newTask
      });

      task.$save(function(res) {
        console.log($scope.newTask);
        $scope.newTask = '';
        $scope.findAll();
      }, function(err) {
        console.log(err);
      });
    };

    $scope.completeTask = function(task) {
      Task.update({ id: task._id }, { completed: true }).$promise
        .then(function() {
          $scope.findAll();
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    $scope.deleteTask = function(task) {
      Task.delete({ id: task._id }).$promise
        .then(function() {
          $scope.findAll();
        })
        .catch(function(err) {
          console.log(err);
        });
    };
  }

  angular.module('taskodoro')
    .controller('TasksController', TasksController);

}());
