var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
	
var data = {};
 
function getTweets(searchTerms, callback) {

	if (searchTerms in data) {
  		console.log("Returning cached results for '" + searchTerms + "' (" + data[searchTerms].length + " urls)");
		callback(data[searchTerms]);
		return;
	}

	console.log("Requesting video tweets for " + searchTerms);

	var optionString = "filter:safe";

	client.get('search/tweets', { q: 'filter:native_video ' + searchTerms + ' ' + optionString }, function(error, tweets, response) {

	  if (error) {

	  	console.log(error);
	  	callback(undefined, error);

	  } else {

	  	var urls = [];

	  	//console.log(tweets);
	  	//console.log("\n---\n");

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
	    if (urls.length > 0) {
	    	data[searchTerms] = urls;
	    }

	    callback(urls);
	  }

	});
}

module.exports = {
	getTweets: getTweets
};
