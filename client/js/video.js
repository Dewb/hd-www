// hd-www 
// video.js
// mpd 2016/06/20

function randomSlice(array, count) {
  var ret = [];
  while (count-- > 0) {
    var x = array.splice(Math.floor(Math.random() * array.length), 1);
    ret.push(x[0]);
  }
  return ret;
}

function getVideoUrls(channelUrls, options, callback) {

  if (options.useLocal) {
    callback(["res/fallback1.mp4", "res/fallback2.mp4"]);
    return;
  }

  options = options || { numPerChannel: 3, crossDomain: true };

  // get the video stream from each channel
  var channelRequests = $.map(channelUrls, function (source) { 
    return $.ajax({
      url: source,
      crossDomain: options.crossDomain,
    }); 
  });

  // when all calls return, pluck out N video URLs from each source
  $.when.apply($, channelRequests).done(function () {
    var videoUrls = $.map(arguments, function (obj) { 
      var videos = obj[0];
      return $.map(
        randomSlice(videos, options.numPerChannel), 
        function (url) { 
          return url;
        }
      );
    });
    callback(videoUrls);
  });

}

function setupRandomPlayVideos(videoUrls, options) {

  var options = options || { audio: false, processAudio: false, useShader: true };
  var audioIndo = undefined;
  if (options.audio && options.processAudio) {
    audioInfo = initAudio(options.delayTime);
  }
 
  // Create a player for each URL and connect to audio chain
  $.each(videoUrls, function (index, url) {
    var player = $('<video />', {
      src: url,
      loop: true,
      crossorigin: "anonymous",
      "webkit-playsinline": "",
    });

    makeVideoPlayableInline(player.get(0));
    player.on('touchstart', function () {
      $.each($('video'), function (i, obj) { obj.play() });
    });

    if (!options.audio) {
      player.get(0).muted = true;
    } else if (options.processAudio) {
      var source = audioInfo.context.createMediaElementSource(player.get(0));
      source.connect(audioInfo.input);
    }

    $('#container').append(player);
  });

  // Return a function to play a randomly selected video, let the caller handle timing
  return function() {
    $('video').hide().each(function() { $(this).get(0).pause(); });
    if (options.audio && options.processAudio) {
      triggerKick(audioInfo.context);
    }
    var playerElem = $('video').random();
    var player = playerElem.get(0);
    if (player) {
      if (options.resetToStartChance > Math.random()) {
        player.currentTime = 0;
      }
      if (options.useShader) {
        updateVideoTexture(player);
        player.play();
      } else {
        playerElem.show();
        var promise = player.play();
        if (promise) { 
          promise.catch(function() {}); 
        }
      }
    }
  }

}
