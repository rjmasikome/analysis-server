"use strict";


var express = require('express');
var bodyParser = require('body-parser');
var localGenerator = require('./localGenerator');
var remoteGenerator = require('./remoteGenerator');
var app = express();
var port = '8080';

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  return next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/local-generate', function (req, res) {
  localGenerator(req.body.url, function (response) {
    res.send(response);
  });
});

app.post('/remote-generate', function (req, res) {
  remoteGenerator(req.body.url, function (response) {
    res.send(response);
  });
});

app.listen(port, function () {
  console.log('Playlist generator is listening on port ' + port + ' !');
});
