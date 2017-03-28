var express = require('express');
var app = express();

var argv = require('yargs').argv;

if (argv.cors) {
	var cors = require('cors');
	app.use(cors());
}

var videoSearch = require('./videoSearch.js');

app.get('/video_search/:terms', function (req, res) {
  var searchTerms = req.params.terms;
  videoSearch.getTweets(searchTerms, function (urls) {
  	res.send(urls);
  });
});

var port = 3000;

console.log("Listening on port " + port) 
app.listen(port)