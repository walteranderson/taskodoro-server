;(function () {
  'use strict';

  function MainCtrl($scope) {
    $scope.text = 'Hey look I work!';
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
