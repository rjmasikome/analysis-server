"use strict";

var imgur = require('imgur-upload');
var playlistGenerator = require('./playlistGenerator');

module.exports = function (url, cb) {
  imgur.setClientID('d4c1ea2055f92f5');
  imgur.upload(path.join(__dirname, 'starry_night.jpg'), function (err, res) {
    if (res.data) {
      playlistGenerator(res.data.link, cb);
      console.log(res.data.link);
    } else {
      console.log('Error:', res)
    }
  });
}
