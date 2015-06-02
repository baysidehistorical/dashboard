'use strict';

angular.module('dbBHS.factories', [])
  .factory('Auth', ['$firebaseAuth', function($firebaseAuth){
    var ref = new Firebase("https://baysidehistorical.firebaseio.com");
    var auth = $firebaseAuth(ref);

    var Auth = {
      obj: function(){ return auth; },
      login: function(){
        return auth.$authWithOAuthPopup("google", { scope:"email"}).then(function(authData) {
                if (authData.google.email.split("@")[1] != "baysidehistorical.org") {
                  auth.$unauth()
                  alert("Please sign in using @baysidehistorical.org email address!");
                }
              }).catch(function(error) {
                console.error("Authentication failed:", error);
              });
      },
      logout: function(){ auth.$unauth(); }
    };
    return Auth;
  }]);
