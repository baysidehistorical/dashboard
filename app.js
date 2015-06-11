'use strict';

angular.module('dbBHS', [
  'firebase',
  'ui.router',
  'ui.bootstrap',
  'dbBHS.factories',
  'dbBHS.directives',
  'dbBHS.controllers'
])

.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider.state("home", {
    controller: "HomeCtrl",
    url: "/",
    templateUrl: "partials/home.html",
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.obj().$waitForAuth();
      }]
    }
  }).state("account", {
    controller: "AccountCtrl",
    url: "/account",
    templateUrl: "partials/account.html",
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.obj().$requireAuth();
      }]
    }
  }).state("eventlist", {
    controller: "EventListCtrl",
    url: "/events",
    templateUrl: "partials/eventlist.html",
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.obj().$requireAuth();
      }]
    }
  });
}])
.constant('FIREBASE_URL', 'https://baysidehistorical.firebaseio.com');
