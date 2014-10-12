;(function () {
  'use strict';

  function MainCtrl($scope) {
    console.log('main controller');
    $scope.item = 'thing';
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
