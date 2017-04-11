// hd-www 
// video.js
// mpd 2016/06/20

import * as audioEngine from './audio'
import * as shader from './shader'

import * as enableIphoneInlineVideo from 'iphone-inline-video'

var useShader = true;

export function getVideoUrls(channelUrls, options, callback) {

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
        videos.slice(0, options.numPerChannel), 
        function (url) { 
          return url;
        }
      );
    });
    callback(videoUrls);
  });

}

export function setupRandomPlayVideos(videoUrls, options) {

  var options = options || { audio: false, processAudio: false, useShader: true };
  var audioInfo = undefined;
  if (options.audio && options.processAudio) {
    audioInfo = audioEngine.initAudio(options.delayTime);
  }

  useShader = options.useShader;
 
  // Create a player for each URL and connect to audio chain
  $.each(videoUrls, function (index, url) {
    var player = $('<video />', {
      src: url,
      loop: true,
      crossorigin: "anonymous",
      "webkit-playsinline": "",
    });

    enableIphoneInlineVideo(player.get(0), true, false);

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

  if (useShader) {
    shader.init3d();
  }

  // Return a function to play a randomly selected video, let the caller handle timing
  return function() {
    $('video').hide().each(function() { $(this).get(0).pause(); });
    if (options.audio && options.processAudio) {
      audioEngine.triggerKick(audioInfo.context);
    }
    var player = $('video').random();
    if (options.resetToStartChance > Math.random()) {
      player.get(0).currentTime = 0;
    }
    if (options.useShader) {
      shader.updateVideoTexture(player.get(0));
      player.get(0).play();
    } else {
      player.show();
      var promise = player.get(0).play();
      if (promise) { 
        promise.catch(function() {}); 
      }
    }
  }

}

export function render() {
  if (useShader) {
    shader.render3d();
  }
}