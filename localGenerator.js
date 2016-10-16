"use strict";

var clarifaiMood = require('./clarifaiMood');
var clarifaiObject = require('./clarifaiObject');

module.exports = function (url, context, cb) {

  if (context === 'mood') {
    clarifaiMood(url, cb);
  } else {
    clarifaiObject(url, cb);
  }

}
