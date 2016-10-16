var playlistGenerator = require('./playlistGenerator');
var request = require('request');

module.exports = function (link, cb) {

  console.log(link);

  request({
    url: 'https://api.clarifai.com/v1/color/?url=' + link, //URL to hit
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Authorization': 'Bearer pig7m8M3FRuNpFRGEGbwBOCUEtJN7Y'

    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      if (JSON.parse(body).status_code === 'ALL_ERROR') {
        error = {
          error: true,
          status: response.statusCode,
          message: JSON.parse(body).status_msg
        }
        cb(error);
        return;
      } else {
        if (JSON.parse(body).results) {

          var results = JSON.parse(body).results[0].colors;
          var maxDens = Math.max.apply(null, results.map((n) => n.density));
          var hex, name;

          results.forEach(function (n) {
            if (n.density === maxDens) {
              hex = n.w3c.hex;
              name = n.w3c.name;
            }
          });

          playlistGenerator(hex, name, cb);
        }
      }
    }
  });
}
