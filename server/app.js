var express = require('express');
var path = require('path');


var videoSearch = require('./videoSearch.js');

var app = express();

app.use('/', express.static(path.join(__dirname, '../client')));

app.get('/video_search/:terms', function (req, res) {
  var searchTerms = req.params.terms;
  videoSearch.getTweets(searchTerms, function (urls) {
  	res.send(urls);
  });
});

var port = 3000;

console.log("Listening on port " + port) 
app.listen(port)