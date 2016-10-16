"use strict";

var playlistGenerator = require('./playlistGenerator');

module.exports = function (url, cb) {
  playlistGenerator(url, cb);
}
