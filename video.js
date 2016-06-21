// hd-www 
// video.js
// mpd 2016/06/20

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
