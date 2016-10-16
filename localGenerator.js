"use strict";

var playlistGenerator = require('./playlistGenerator');

module.exports = function (url, cb) {
  playlistGenerator('https://upload.wikimedia.org/wikipedia/commons/e/e0/Clouds_over_the_Atlantic_Ocean.jpg', cb);
}
