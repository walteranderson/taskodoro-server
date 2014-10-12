;(function () {
  'use strict';

  function Task($resource) {
    return $resource('/api/tasks/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular.module('taskodoro')
    .factory('Task', Task);

}());
