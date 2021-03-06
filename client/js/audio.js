// hd-www 
// audio.js
// mpd 2016/06/20

function initAudio(delayTime) {

  var AudioContext = window.AudioContext || window.webkitAudioContext;
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

  // kick drum technique from 
  // http://stackoverflow.com/questions/31773754/how-to-make-oscillator-based-kick-drum-sound-exactly-the-same-every-time/

  var oscillator = context.createOscillator();
  var gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);

  var t = context.currentTime;

  oscillator.frequency.value = 110;
  oscillator.frequency.setValueAtTime(110, t);
  oscillator.frequency.exponentialRampToValueAtTime(10, t + 0.2);
  gain.gain.setValueAtTime(1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.33);

  oscillator.start(t);
  oscillator.stop(t + 0.4);
}