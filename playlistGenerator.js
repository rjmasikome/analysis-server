"use strict";

var path = require('path'),
  async = require('async'),
  colorMood = require('./config.json').colors,
  request = require('request');

var spotify_token = require('./config.json').spotify_token;

function generatePlaylist(tracksArray, mood, cb) {

  var random20 = [],
    userID = '1295035952',
    playlistID = '6zAmneHRSorsUKKKzPMUY1';

  tracksArray.forEach(function (n, i, array) {
    if (i < 20) {
      var randomIndex = Math.floor(Math.random() * array.length);
      random20.push(array[randomIndex]);
      array.splice(randomIndex, 1);
    }
  });

  var obj = {
    uris: random20
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
        "status": response.statusCode,
        "message": "New playlist is generated",
        "mo_od": mood + "_",
        "user_id": userID,
        "playlist_id": playlistID
      }
      console.log('Status:', response.statusCode, "New playlist is generated");
      cb(success);
    }
  });


}

function getTracks(playlistID, mood, cb) {

  var resend = function () {
    getTracks(playlistID);
  };

  request({
    url: 'https://api.spotify.com/v1/users/spotify/playlists/' + playlistID, //URL to hit
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Authorization': 'Bearer ' + spotify_token

    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
      if (error.message === "The access token expired") {
        // requestNewToken();
      }
    } else {
      var tracks = [];

      // console.log(response.statusCode);
      var results = JSON.parse(body).tracks ? JSON.parse(body).tracks.items : [];

      if (results.length > 0) {

        async.each(results, function (n, callback) {

          if (n.track) {
            tracks.push(n.track.uri);
            callback();
          } else {
            console.log("Error adding track");
            callback("Error adding track");
          }

        }, function (err) {
          // if any of the file processing produced an error, err would equal that error
          if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('Failed to process');
          } else {
            generatePlaylist(tracks, mood, cb);
          }
        });
      } else {
        console.log(JSON.parse(body));
        // setTimeout(resend, 1000);
        cb(JSON.parse(body));
      }

      // assignNearestMood(hex, name);
    }
  });
}


module.exports = function (hex, name, cb) {

  var distance = [],
    nearColorIndex,
    minDistance;

  name = name.toLowerCase();
  colorMood.map((n) => n.color).forEach(function (n, i, array) {
    if (name.includes(n)) {
      nearColorIndex = i;
    }
  });
  if (!nearColorIndex) {
    colorMood.map((n) => n.hex).forEach(function (n, i, array) {
      var obj = {
        index: i,
        value: Math.abs(parseInt(hex.substring(1), 16) - parseInt(n, 16))
      };

      distance.push(obj);
      // console.log(Math.abs(parseInt(hex.substring(1), 16) - parseInt(n, 16)));
    });

    minDistance = Math.min.apply(null, distance.map((n) => n.value));

    distance.forEach(function (n) {
      if (n.value === minDistance) {
        nearColorIndex = n.index;
      }
    });
  }

  console.log('Mood:', colorMood[nearColorIndex].mood);
  getTracks(colorMood[nearColorIndex].playlist[Math.floor(Math.random() * colorMood[nearColorIndex].playlist.length)], colorMood[nearColorIndex].mood, cb);

}
