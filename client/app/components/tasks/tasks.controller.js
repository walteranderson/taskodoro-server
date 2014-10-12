;(function () {
  'use strict';

  function TasksController($scope, $stateParams, Task) {

    $scope.findAll = function() {
      $scope.tasks = Task.query();
    };

    $scope.findOne = function() {
      $scope.id = $stateParams.id;
    };

    $scope.addTask = function(newTask) {
      var task = new Task({
        text: newTask
      });

      task.$save(function(res) {
        $scope.newTask = '';
        $scope.findAll();
      }, function(err) {
        console.log(err);
      });
    };

    $scope.completeTask = function(task) {
      Task.update({ id: task._id }, { completed: true })
        .$promise.then(function() {
          $scope.findAll();
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }

  angular.module('taskodoro')
    .controller('TasksController', TasksController);

}());
