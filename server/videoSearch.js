var Twitter = require('twitter');
var cache = require('memory-cache');
var nconf = require('nconf');

nconf.file('secrets', __dirname +'/config/secrets.json');

var client = new Twitter({
  consumer_key: nconf.get('twitter:consumer_key'),
  consumer_secret: nconf.get('twitter:consumer_secret'),
  access_token_key: nconf.get('twitter:access_token_key'),
  access_token_secret: nconf.get('twitter:access_token_secret')
});

// Minimum cache time to stay under Twitter rate limits:
// 450 requests per 15 minute window = 2000ms between requests

var twitterRateLimit = 2000;
var cacheTime = twitterRateLimit * 2 * 3;

function getTweets(searchTerms, callback) {

	var cacheData = cache.get(searchTerms);
	if (cacheData) {
  		console.log("Returning cached results for '" + searchTerms + "' (" + cacheData.length + " urls)");
		callback(cacheData);
		return;
	}

	console.log("Requesting video tweets for " + searchTerms);

	var optionString = "filter:safe";

	client.get('search/tweets', { q: 'filter:native_video ' + searchTerms + ' ' + optionString }, function(error, tweets, response) {

	  if (error) {

	  	console.log(error);
	  	callback([], error);

	  } else {

	  	var urls = [];

	  	console.log("Search returned " + tweets['statuses'].length + " tweets");

	    tweets['statuses'].map(function (t) {
	    	if ('extended_entities' in t && 'media' in t['extended_entities']) {
		    	var media = t['extended_entities']['media'];
		    	if (media.length > 0) {
		    		var video = media[0];
		    		if ('video_info' in video && 'variants' in video['video_info']) {
		    			var variants = video['video_info']['variants'];
		    			for (var i = variants.length - 1; i > 0; i--) {
		    				
		    				if ('content_type' in variants[i] && 
		    					'url' in variants[i] && 
		    					variants[i]['content_type'] === 'video/mp4') {
	    						
	    						urls.push(variants[i].url);
	    						break;
	    					}
	    				}
	    			}
	    		}
	    	}
	    });

	    console.log("Tweets contained " + urls.length + " video urls");
	    cache.put(searchTerms, urls, cacheTime);

	    callback(urls);
	  }

	});
}

module.exports = {
	getTweets: getTweets
};
