"use strict";

var imgur = require('imgur');
var clarifaiMood = require('./clarifaiMood');

module.exports = function (data, context, cb) {
  imgur.setClientId('d4c1ea2055f92f5');
  imgur.uploadBase64(data)
    .then(function (res) {

      if (context === 'mood') {
        clarifaiMood(res.data.link, cb);
      }

    })
    .catch(function (err) {
      console.error(err);
      cb(err);
      return;
    });

}
