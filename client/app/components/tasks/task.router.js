;(function () {
  'use strict';

  function TasksRouter($stateProvider) {
    $stateProvider
      .state('tasks', {
        abstract: true,
        url: '/tasks',
        templateUrl: 'app/components/tasks/views/tasks.layout.html',
        controller: 'TasksController'
      })
      .state('tasks.list', {
        url: '',
        templateUrl: 'app/components/tasks/views/tasks.list.html'
      })
      .state('tasks.edit', {
        url: '/:id',
        templateUrl: 'app/components/tasks/views/task.edit.html'
      });
  }

  angular.module('taskodoro')
    .config(TasksRouter);

}());
