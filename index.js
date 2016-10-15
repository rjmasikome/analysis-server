"use strict";

var imgur = require('imgur-upload'),
  path = require('path'),
  async = require('async'),
  colorMood = require('./config.json').colors,
  request = require('request');

var spotify_token = "BQDRpkjiaXRhn8BVHyx-eA19KlW_hsgB3l1glT2cYlMkexrkm94YBPpmkY2UnGAom4gEr5dS5bgsW8OKQUw0tSxq5NJVGSwEmyC3aCKWe3zCUh8P4vixL1JvmwWscKwAR-UFQE7BWAX0fOvITVf7nSQPBsd-udQlDAXOljQsX8Lm0CSsBGCqzBVUNamKiUmCjdTgBL3XfblAtVEPbnOoWb6C-bADXJnMv5E";

function generatePlaylist(tracksArray) {

  var random20 = [];

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

  console.log("Yas");

  request({
    url: 'https://api.spotify.com/v1/users/1295035952/playlists/6zAmneHRSorsUKKKzPMUY1/tracks', //URL to hit
    method: 'PUT', //Specify the method
    headers: { //We can define headers too
      'Authorization': 'Bearer ' + spotify_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)

  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {

      var tracks = [];
      console.log(response.statusCode);
    }
  });


}

function getTracks(playlistID) {

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
            console.log('All tracks added');
            generatePlaylist(tracks);
          }
        });
      } else {
        console.log(JSON.parse(body));
        setTimeout(resend, 1000);
      }

      // assignNearestMood(hex, name);
    }
  });
}


function assignNearestMood(hex, name) {

  var distance = [],
    nearColorIndex,
    minDistance;

  name = name.toLowerCase();

  colorMood.map((n) => n.color).forEach(function (n, i, array) {
    console.log(n);
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
    console.log(distance);

    distance.forEach(function (n) {
      if (n.value === minDistance) {
        nearColorIndex = n.index;
      }
    });
  }

  console.log(colorMood[nearColorIndex].color);
  console.log('Mood:', colorMood[nearColorIndex].mood);
  console.log('Playlist:', colorMood[nearColorIndex].playlist[Math.floor(Math.random() * colorMood[nearColorIndex].playlist.length)]);

  getTracks(colorMood[nearColorIndex].playlist[Math.floor(Math.random() * colorMood[nearColorIndex].playlist.length)]);

}

function sendToClarifai(link) {

  request({
    url: 'https://api.clarifai.com/v1/color/?url=' + link, //URL to hit
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Authorization': 'Bearer uPIO5akzN5Pbh2Ivqd1oPUUuWT1eSp'

    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      // console.log(response.statusCode);
      var results = JSON.parse(body).results[0].colors;
      var maxDens = Math.max.apply(null, results.map((n) => n.density));
      var hex, name;

      results.forEach(function (n) {
        if (n.density === maxDens) {
          hex = n.w3c.hex;
          name = n.w3c.name;
        }
      });

      assignNearestMood(hex, name);
    }
  });
}

// imgur.setClientID('d4c1ea2055f92f5');
// imgur.upload(path.join(__dirname, 'starry_night.jpg'), function (err, res) {
//   if (res.data) {
//     sendToClarifai(res.data.link);
//     console.log(res.data.link);
//   } else {
//     console.log('Error:', res)
//   }
// });

// var testLink = 'http://i.imgur.com/tKWwUSs.png'; // Download
var testLink = 'http://i.imgur.com/T14gkcF.jpg'; // Starry Night

sendToClarifai('https://upload.wikimedia.org/wikipedia/commons/e/e0/Clouds_over_the_Atlantic_Ocean.jpg');
