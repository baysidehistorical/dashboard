'use strict';

angular.module('dbBHS.controllers', [])
  .controller('HomeCtrl', ['$scope', 'Auth', 'currentAuth', function($scope, Auth, currentAuth) {
    Auth.obj().$onAuth(function(authData) {
      $scope.authData = authData;
      if (authData) {
        $scope.msg = "Welcome, " + authData.google.displayName;
      }
    });
  }])
  .controller('AccountCtrl', ['$scope', 'Auth', 'currentAuth', function($scope, Auth, currentAuth) {
    $scope.msg = "Account overview";
    Auth.obj().$onAuth(function(authData) {
      $scope.authData = authData;
    });
  }])
  .controller('EventCtrl', ['$scope', 'Event', function($scope, Event) {
    $scope.dca = false;

    $scope.handleFileSelectAdd = function(evt) {
      var f = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          var filePayload = e.target.result;
          $scope.eventImgData = e.target.result;
          document.getElementById('pano').src = $scope.eventImgData;
        };
      })(f);
      reader.readAsDataURL(f);
    };
    document.getElementById('file-upload').addEventListener('change', $scope.handleFileSelectAdd, false);

    $scope.create = function() {
      var eventData = {};
      eventData.title = $scope.title;
      eventData.description = $scope.description;
      eventData.cost = { member: $scope.member, nonmember: $scope.nonmember };
      eventData.date = $scope.date;
      eventData.time = { from: $scope.from, to: $scope.to };
      eventData.dca = $scope.dca;
      eventData.image = $scope.eventImgData;
      // console.log(eventData);
      Event.create(eventData).then(function (){
          // console.log("Cleaning up");
          // eventData = {};
      });
    }
  }])
  .controller('EventListCtrl', ['$scope', 'Auth', 'currentAuth', 'Event', '$modal', function($scope, Auth, currentAuth, Event, $modal) {
    $scope.msg = "All events";
    $scope.oneAtATime = true;
    $scope.isFirstOpen = true;
    $scope.isCollapsed = true;

    $scope.addEvent = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.events = Event.all;

    $scope.open = function (event) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          event: function () {
            return event;
          }
        }
      });

      modalInstance.result.then(function (eventData) {
        Event.delete(eventData);
        console.log("This is deleted");
      }, function () {
        console.log("This is cancel");
      });
    };

  }])
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, event) {
    $scope.event = event;
    $scope.delete = function () {
      $modalInstance.close($scope.event);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('SidebarCtrl', ['$scope', function($scope) {
    $scope.currentTab = 'home';

    $scope.setTab = function (value) { $scope.currentTab = value; };

    $scope.isCurrentTab = function (value) {
      if ($scope.currentTab === value) return true;
      else return false;
    };
  }]);
