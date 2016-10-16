"use strict";


var express = require('express');
var bodyParser = require('body-parser');
var localGenerator = require('./localGenerator');
var remoteGenerator = require('./remoteGenerator');
var app = express();
var port = '8080';
var headers = {
  'Access-Control-Allow-Origin': "*"
}

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/local-generate', function (req, res) {
  localGenerator(req.body.url, function (response) {
    res.set(headers);
    res.send(response);
  });
});

app.post('/remote-generate', function (req, res) {
  remoteGenerator(req.body.url, function (response) {
    res.set(headers);
    res.send(response);
  });
});

app.listen(port, function () {
  console.log('Playlist generator is listening on port ' + port + ' !');
});
