// hd-www 
// utils.js
// mpd 2016/06/20

// Extension method to return a different random element each call
$.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * (this.length - 1));  
    if (randomIndex >= $.fn.random.last) {
      randomIndex += 1;
    }
    $.fn.random.last = randomIndex;
    return $(this[randomIndex]);
};
$.fn.random.last = 0;
