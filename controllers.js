'use strict';

angular.module('dbBHS.controllers', [])
  .controller("HomeCtrl", ["$scope", "Auth", "currentAuth", function($scope, Auth, currentAuth) {
    Auth.obj().$onAuth(function(authData) {
      $scope.authData = authData;
      if (authData) {
        $scope.msg = "Welcome, " + authData.google.displayName;
      }
    });
  }])
  .controller('AccountCtrl', ["$scope", "Auth", "currentAuth", function($scope, Auth, currentAuth) {
    $scope.msg = "Account Overview";
  }])
  .controller('EventListCtrl', ["$scope", "Auth", "currentAuth", function($scope, Auth, currentAuth) {
    $scope.msg = "All Events";
  }])
  .controller('SidebarCtrl', ["$scope", function($scope) {
    $scope.currentTab = 'home';

    $scope.setTab = function (value) { $scope.currentTab = value; };

    $scope.isCurrentTab = function (value) {
      if ($scope.currentTab === value) return true;
      else return false;
    };
  }]);
