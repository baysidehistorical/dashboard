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

    // This function get called when an image is uploaded and convert it to base64 image
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
    // Listening to the input with id file-upload, when an image is selected, handleFileSelectAdd get called
    document.getElementById('file-upload').addEventListener('change', $scope.handleFileSelectAdd, false);

    // This function get called when create button on event form is clicked
    $scope.create = function() {
      // Getting event data from the form and set it to a json object
      var eventData = {};
      eventData.title = $scope.title;
      eventData.description = $scope.description;
      eventData.cost = { member: $scope.member, nonmember: $scope.nonmember, custom: $scope.custom };
      eventData.date = $scope.date;
      eventData.time = { from: $scope.from, to: $scope.to };
      eventData.dca = $scope.dca;
      eventData.image = $scope.eventImgData;
      // Passing event data to the Event Factory
      Event.create(eventData).then(function (){
          // Clear the form after event data is stored in firebase successfully
          $scope.title = ""; $scope.description = "";
          $scope.member = ""; $scope.nonmember = ""; $scope.custom = "";
          $scope.date = null; $scope.from = null; $scope.to = null;
          $scope.dca = false;
          // Clear the pano img to a 1x1 pixel gif
          document.getElementById('pano').src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          $scope.isCollapsed = true;
      });
    }

  }])
  .controller('EventListCtrl', ['$scope', 'Auth', 'currentAuth', 'Event', '$modal', function($scope, Auth, currentAuth, Event, $modal) {
    $scope.msg = "All events";
    $scope.oneAtATime = true; // Opening event list tab on at a time
    $scope.isFirstOpen = true; // By default, first event list tab open automatically when page is loaded
    $scope.isCollapsed = true; // Create event form

    // Show create event form when function get called
    $scope.addEvent = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.events = Event.all; // Firebase child/array "events" from Event factory

    // This function get called when modal is opened
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
        alert("Event deleted!");
      }, function () {
        console.log("Event deletion is canceled");
      });
    };

    /* COMING SOON
    $scope.edit = function(eventData){
      $scope.isCollapsed = false;
      $scope.title = eventData.title;
      $scope.description = eventData.description;
      $scope.member = eventData.cost.member; $scope.nonmember = eventData.cost.nonmember; $scope.custom = eventData.cost.custom;
      $scope.date = eventData.date;
      $scope.from = eventData.time.from; $scope.to = eventData.time.to;
      $scope.dca = eventData.dca;
      $scope.image = eventData.image;
    }
    */

  }])
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, event) {
    $scope.event = event;
    // Function get called when either delete or cancel button on modal is clicked
    $scope.delete = function () {
      $modalInstance.close($scope.event);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('SidebarCtrl', ['$scope', function($scope) {
    // Changing current active tab on the sidebar
    $scope.currentTab = 'home';
    $scope.setTab = function (value) { $scope.currentTab = value; };

    $scope.isCurrentTab = function (value) {
      if ($scope.currentTab === value) return true;
      else return false;
    };
  }]);
