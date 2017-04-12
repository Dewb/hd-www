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

app.get('/health', function (req, res) {
  videoSearch.getTweets("dance", function (urls, error) {
  	if (urls.length > 0 && !error) {
	  res.status(200).send({ serverUp: true, twitterUp: true });
	} else {
	  res.status(500).send({ serverUp: true, twitterUp: false, error: error });	
	}
  });
});

var port = 3000;

console.log("Listening on port " + port) 
app.listen(port)