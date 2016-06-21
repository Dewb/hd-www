
function initAudio(delayTime) {

  var context = new AudioContext();
  
  var filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3400;
  filter.Q = 1.6;

  var delay = context.createDelay(0.5);
  delay.delayTime.value = delayTime/1000;

  var gain = context.createGain();
  gain.gain.value = 0.7;

  filter.connect(context.destination);

  filter.connect(delay);
  delay.connect(gain);
  gain.connect(context.destination)

  return {
    context: context,
    input: filter,
  };
}

function triggerKick(context) {

  var oscillator = context.createOscillator();
  var gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);

  var t = context.currentTime;

  //oscillator.frequency.value = 5000; // for obvious glitch
  oscillator.frequency.value = 110;
  oscillator.frequency.setValueAtTime(110, t);
  oscillator.frequency.exponentialRampToValueAtTime(10, t + 0.2);
  gain.gain.setValueAtTime(1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.33);

  oscillator.start(t);
  oscillator.stop(t + 0.4);
}

function getVineVideoUrls(channelUrls, options, callback) {

  options = options || { numPerChannel: 3 };

  // get the video stream from each channel
  var channelRequests = $.map(channelUrls, function (source) { return $.ajax(source); })

  // when all calls return, pluck out N video URLs from each source
  $.when.apply($, channelRequests).done(function () {
  	var videoUrls = $.map(arguments, function (obj) { 
  		var videos = obj[0]["data"]["records"];
  		return $.map(
  			videos.slice(0, options.numPerChannel), 
  			function (v) { return v["videoUrl"]; }
  		);
  	});
 	callback(videoUrls);
  });

}

function randomPlayVideos(videoUrls, options) {

  var options = options || { interval: 200 };
  var audioIndo = undefined;
  if (options.audio && options.processAudio) {
    audioInfo = initAudio(options.delayTime);
  }
 
  // Create a player for each URL and connect to audio chain
  $.each(videoUrls, function (index, url) {
    var player = $('<video />', {
	    src: url,
	    loop: true,
      crossorigin: "anonymous"
    });

    if (!options.audio) {
      player.get(0).muted = true;
    } else if (options.processAudio) {
      var source = audioInfo.context.createMediaElementSource(player.get(0));
      source.connect(audioInfo.input);
    }

    player.appendTo('body');
  });

  // Unpause and show a randomly selected video every <interval> milliseconds
  window.setInterval(function() {
	  $('video').hide().each(function() { $(this).get(0).pause(); });
    if (options.audio && options.processAudio) {
      triggerKick(audioInfo.context);
  	}
    var player = $('video').random().show().get(0);
    if (options.resetToStartChance > Math.random()) {
      player.currentTime = 0;
    }
    player.play().catch(function() {});
  }, options.interval);

}
