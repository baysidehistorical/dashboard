'use strict';


angular.module('dbBHS.factories', [])
  .factory('Auth', function ($firebaseAuth, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL);
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
  })
  .factory('Event', function (FIREBASE_URL, $firebaseArray) {
    var ref = new Firebase(FIREBASE_URL + "/events");
    var events = $firebaseArray(ref);

    var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    var Event = {
      all: events,
      create: function(eventData) {
        if (eventData.cost.member == null && eventData.cost.nonmember == null){
          eventData.cost.member = 0;
          eventData.cost.nonmember = 0;
          // console.log("This is a FREE event!");
        }
        // Convert date object to store in Firebase
        var d = eventData.date;
        eventData.date = d_names[d.getDay()] + ", " + m_names[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
        eventData.time.from = tts(eventData.time.from);
        eventData.time.to = tts(eventData.time.to);

        return events.$add(eventData);
      },
      edit: function(eventData) {
        events.$getRecord(eventData);
      },
      delete: function(eventData) {
        events.$remove(eventData).then(function (){
          console.log("Event removed!");
        })
      }
    };

    return Event;
  });

function tts(time){
  var a_p = "";
  var d = time;
  var curr_hour = d.getHours();
  if (curr_hour < 12) a_p = "AM";
  else a_p = "PM";

  if (curr_hour == 0) curr_hour = 12;
  if (curr_hour > 12) curr_hour = curr_hour - 12;

  var curr_min = d.getMinutes();

  curr_min = curr_min + "";

  if (curr_min.length == 1) curr_min = "0" + curr_min;

  return curr_hour + ":" + curr_min + " " + a_p;
}
