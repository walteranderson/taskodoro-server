;(function () {
  'use strict';

  function MainCtrl($scope, Auth) {
    $scope.text = 'Hey look I work!';

    Auth.getCurrentUser()
      .then(function(user) {
        $scope.user = user;
    });
  }

  angular.module('taskodoro')
    .controller('MainCtrl', MainCtrl);

}());
