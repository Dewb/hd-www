// hd-www 
// utils.js
// mpd 2016/06/20

// Extension method to return a different random element each call
jQuery.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * (this.length - 1));  
    if (randomIndex >= jQuery.fn.random.last) {
      randomIndex += 1;
    }
    jQuery.fn.random.last = randomIndex;
    return jQuery(this[randomIndex]);
};
jQuery.fn.random.last = 0;
