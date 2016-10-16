var objectPlaylistGenerator = require('./objectPlaylistGenerator');
var request = require('request');

module.exports = function (link, cb) {

  console.log(link);

  request({
    url: 'https://api.clarifai.com/v1/tag/?url=' + link, //URL to hit
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

          var result = JSON.parse(body).results[0].result.tag.classes;
          var randomQuery = result[Math.floor(Math.random() * result.length)];

          objectPlaylistGenerator(randomQuery, cb);

        }
      }
    }
  });
}
