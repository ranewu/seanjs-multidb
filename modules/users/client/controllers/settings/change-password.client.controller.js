'use strict';

angular.module('user').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function(isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/user/password', $scope.passwordDetails).then(function(response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).catch(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);