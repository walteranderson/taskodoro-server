;(function () {
  'use strict';

  function SettingsCtrl($scope, Auth) {
    $scope.message = '';

    $scope.changePassword = function(user) {
      Auth.changePassword(user.oldPassword, user.newPassword)
        .then(function(data) {
          $scope.message = 'Success!';
        })
        .catch(function(err) {
          $scope.message = 'Oops!';
          console.log(err);
        });
    };

  }

  angular.module('taskodoro')
    .controller('SettingsCtrl', SettingsCtrl);

}());
