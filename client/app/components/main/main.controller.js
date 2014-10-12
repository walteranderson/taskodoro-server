;(function () {
  'use strict';

  function MainCtrl($scope) {
    $scope.item = 'thing';
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
