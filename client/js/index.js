import * as video from './video.js'
import * as utils from './utils.js'

import Detector from 'three/examples/js/Detector'

window.addEventListener('load', function(e) {

  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
  if ((is_chrome)&&(is_safari)) {is_safari=false;}
  if ((is_chrome)&&(is_opera)) {is_chrome=false;}

  reposition();

  $("#title").fadeIn(600);
  $(".toolbar").fadeIn(1100);

  video.getVideoUrls(
    [
      "http://localhost:3000/video_search/dance",
      "http://localhost:3000/video_search/weird",
      //"http://localhost:3000/video_search/c-span",
    ], 
    {
      numPerChannel: 2,
      useLocal: false,
      crossOrigin: false
    },
    function (urls) {
       var beatFn = video.setupRandomPlayVideos(urls, { 
        interval: 610, 
        audio: true, 
        processAudio: true, 
        resetToStartChance: 0.7,
        delayTime: 300,
        // Use WebGL shader effects only if WebGL is supported and we're not Safari
        useShader: Detector.webgl && !is_safari,
      });

      window.beatInterval = 580;
      window.lastBeat = 0;

      var frameFn = function(time) {
        if (time - window.lastBeat > window.beatInterval) {
          beatFn();
          window.lastBeat = time;
        }
        video.render();
        window.requestAnimationFrame(frameFn);
      }

      if (localStorage["hideUI"]) {
        $(".ui").hide();
      }

      window.requestAnimationFrame(frameFn);

    }
  );
});

window.addEventListener('resize', function(e) {
  reposition();
});

function reposition() {
  var h = $(window).height(), w = $(window).width();
  $('.reposition-bottom').css({'top' : (h - 180) + 'px'});
  $('.reposition-right').css({'left' : (w - 160) + 'px'});
}

$("#show-about").click(function() {
  if ($('#about').css('display') == 'none') {
    $('#about').fadeIn();
    $("#show-about").text("hide");
  } else {
    $(".ui").fadeOut();
  }
});

$("#reload").click(function() {
  window.location.reload();
});

$("#fast").click(function() {
  $(".speed").show();
  $("#fast").hide();
  window.beatInterval = 580;
});

$("#slow").click(function() {
  $(".speed").show();
  $("#slow").hide();
  window.beatInterval = 920;
});

$("#faster").click(function() {
  $(".speed").show();
  $("#faster").hide();
  window.beatInterval = 410;
});
