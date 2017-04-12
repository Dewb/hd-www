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
  $("#info").delay(2000).fadeIn(800);
  $("#bpm").delay(2000).fadeIn(800);

  getVideoUrls(
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
       var beatFn = setupRandomPlayVideos(urls, { 
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

      init3d();

      var frameFn = function(time) {
        if (time - window.lastBeat > window.beatInterval) {
          beatFn();
          window.lastBeat = time;
        }
        render3d();
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

$("#info").click(function() {
  if ($('#about').css('display') == 'none') {
    $("#info").hide();
    $('#about').fadeIn();
  }
});

var speeds = [920, 410, 580];

$("#bpm").click(function() {
  window.beatInterval = speeds[0];
  speeds.push(speeds.shift());
});

$(".hideui").click(function() {
  $('#about').fadeOut();
  $('#bpm').fadeOut();
});

