'use strict';

angular.module('dbBHS.directives', [])
  .directive('dbnav', ['Auth', function (Auth) {
    return {
      restrict: 'E',
      templateUrl: 'partials/db-nav.html',
      controller: function ($scope) {
        // any time auth status updates, add the user data to scope
        Auth.obj().$onAuth(function(authData) {
          $scope.authData = authData;
        });
        $scope.login = function(){ Auth.login(); };
        $scope.logout = function(){ Auth.logout(); };
      },
      controllerAs: 'NavCtrl'
    };
  }]);
