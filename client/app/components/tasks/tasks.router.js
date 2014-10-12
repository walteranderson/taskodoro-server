;(function () {
  'use strict';

  function TasksRouter($stateProvider) {
    $stateProvider
      .state('tasks', {
        abstract: true,
        url: '/tasks',
        templateUrl: 'app/components/tasks/views/tasks.layout.html',
        controller: 'TasksController',
        authenticate: true
      })
      .state('tasks.list', {
        url: '',
        templateUrl: 'app/components/tasks/views/list-tasks.html'
      })
      .state('tasks.edit', {
        url: '/:id',
        templateUrl: 'app/components/tasks/views/edit-task.html'
      });
  }

  angular.module('taskodoro')
    .config(TasksRouter);

}());
