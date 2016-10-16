"use strict";

var spotify_token = require('./config.json').spotify_token;
var request = require('request');


function generatePlaylist(tracksArray, mood, cb) {

  var userID = '1295035952',
    playlistID = '6zAmneHRSorsUKKKzPMUY1';


  var obj = {
    uris: tracksArray
  }

  request({
    url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks', //URL to hit
    method: 'PUT', //Specify the method
    headers: { //We can define headers too
      'Authorization': 'Bearer ' + spotify_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)

  }, function (error, response, body) {
    if (error) {
      console.log(error);
      cb(error);
    } else {

      var tracks = [];
      var success = {
        status: response.statusCode,
        message: "New playlist is generated",
        mo_od: mood + "_",
        user_id: userID,
        playlist_id: playlistID
      }
      console.log(mood);
      console.log('Status:', response.statusCode, "New playlist is generated");
      cb(success);
    }
  });


}


module.exports = function (query, cb) {

  request({
    url: 'https://api.spotify.com/v1/search/?type=track&q=' + query, //URL to hit
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Authorization': 'Bearer ' + spotify_token,
      'Content-Type': 'application/json'
    }

  }, function (error, response, body) {
    if (error) {
      console.log(error);
      cb(error);
    } else {

      var results = JSON.parse(body).tracks ? JSON.parse(body).tracks.items : [];
      if (results.length > 0) {
        var tracks = results.map((n) => n.uri);
        generatePlaylist(tracks, query, cb);
      } else {
        cb(JSON.parse(body));
      }
    }
  });

};
