
var xTimer;
var lookupLevel = {
          0 : 'Warm Up', 
          1 : 'Warm Up', 
          2 : '6', 
          3 : '7', 
          4 : '8', 
          5 : '9 - HIGH', 
          6 : '6', 
          7 : '7', 
          8 : '8', 
          9 : '9 - HIGH', 
          10: '6', 
          11: '7', 
          12: '8', 
          13: '9 - HIGH', 
          14: '6', 
          15: '7', 
          16: '8', 
          18: '9', 
          19: '10', 
          20: 'Cool Down',
          21: 'FINISH!'
        };

// var audioIndex = [4,5,6,7,8,9,6,7,8,9,6,7,8,9,6,7,8,9,10,11]
var audioIndex = (function(){
  var arr = [];
  var i;
  for(i=4;i<11;i++){ 
    arr.push(i); 
  }
  return arr;
})();
// var audioObjects = {};
var currentMins;
var currentSecs;
var playSound;
var startSounds;

$(document)
    .ready(function(){
				eachMinutePlaySound(startSounds);
      setInterval(function(){
          try {
            currentMins = getTime('mins');
            currentSecs = getTime('secs');
          } catch (e) {
            console.log(e);
            currentMins = 0;
            currentSecs = 0;
          }
          var val = lookupLevel[currentMins];
          $('#target-goal').text(val);
          startSounds = (currentMins == 0 && currentSecs == 0);
      }, 1000);
        xTimer = new clsStopwatch(parseInt(Cookies.get('time')||0), {
            onStart: function() {
                Cookies.set('state', true)
                $('#time, #clock-icon').addClass('active')
                toggleStopResetButtons();
            },
            onStop: function() {
                Cookies.set('state', false)
                $('#time, #clock-icon').removeClass('active')
                toggleStopResetButtons();
            },
            onReset: function() {
                $('#startClock').removeAttr('disabled')
                $('#time').html(this.timeFormatted(true));
                Cookies.set('time', 0);
            },
            onUpdate: function() {
                $('#time').html(this.timeFormatted(true));
                Cookies.set('time', xTimer.time())
            }
        });

        $('#time').html(xTimer.timeFormatted(true));
        if(Cookies.get('state')=='true'){
            xTimer.start();
        }
        toggleStopResetButtons();
    })
    .on('click', '#startClock', function() {
        if(xTimer.time() == 0) {
            xTimer.start();
        } else {
            xTimer.start();
        }
    })
    .on('click', '#stopClock', function() {
        xTimer.stop();
    })
    .on('click', '#resetClock', function() {
        xTimer.stop();
        xTimer.reset();
        Cookies.set('time', 0); 
    })
    .on('click', '#logTime', function() {
        xTimer.stop();
        logTimePost();
    })
    
function toggleStopResetButtons(started){
  if(Cookies.get('state')=='true' || started == 'true'){
    $('#stopClock').removeClass('hide');
    $('#resetClock').addClass('hide');
  } else {
    $('#stopClock').addClass('hide');
    $('#resetClock').removeClass('hide');
  }
}
// Stopwatch class modified from https://gist.github.com/electricg/4372563
var	clsStopwatch = function(strSecs, options) {
    // Private vars
    var	startAt	=  0;	// Time of last start / resume. (0 if not running)
    var	lapTime	= strSecs || 0;	// Time on the clock when last stopped in milliseconds
    var interval;

    var	now	= function() {
        return (new Date()).getTime();
    };

    // Public methods
    // Start or resume
    this.start = function() {
        if (interval) return; //Already started
        startAt	= startAt ? startAt : now();
        if (options.onStart) options.onStart.call(this)
        if (options.onUpdate) {
            var _this = this
            interval = setInterval(function() {
              options.onUpdate.call(_this)
            }, 1000)
        }
    };

    // Stop or pause
    this.stop = function() {
        // If running, update elapsed time otherwise keep it
        lapTime	= startAt ? lapTime + now() - startAt : lapTime;
        startAt	= 0; // Paused
        if (options.onStop) options.onStop.call(this)
        if (interval)  {
            clearInterval(interval)
            interval = null
        }
    };

    // Reset
    this.reset = function() {
        lapTime = startAt = 0;
        if (interval) {
            clearInterval(interval)
            interval = null
        }
        if (options.onReset) options.onReset.call(this)
    };

    // Duration
    this.time = function() {
        return lapTime + (startAt ? now() - startAt : 0);
    };

    this.timeFormatted = function(include_hours) {
        var include_hours = false;
        var date = new Date(null);
        date.setTime(this.time())
        return date.toISOString().substr(include_hours ? 11 : 14, include_hours ? 8 : 5).replace(/\:(\d\d)$/,'<span>:</span><span id="clock-seconds">$1</span>');
    };
};


function eachMinutePlaySound(start){
  var mins = getTime('mins');
  var secs = getTime('secs');
  setInterval(function(){
    var localMins = getTime('mins');
    var localSecs = getTime('secs');
    var clockSecs = $('#clock-seconds').text();
    if(Cookies.get('state')=='true' && getTime(secs) < 1) {
      playAudio(audioIndex[currentMins]);
    }
  }, 1000);

}

function getTime(minSec){
  if(minSec == 'mins'){
    return Math.floor(Cookies.get('time') / 60 / 1000) || 0;
  } else {
    return Math.floor(Cookies.get('time') / 1000) || 0;
  }
}


function playAudio(level) {
  var output;
  switch (level) {
    case 3:
      output = 'Begin warm-up.'
      break;
    case 4:
      output = 'Warm Up. Level 5'
      break;
    case ([5,9,13].indexOf(level) > -1):
      output = 'Level ' + level + '. High Point';
      break;
    default:
      output = 'Level ' + level;
  }
  var msg = new SpeechSynthesisUtterance(output);
  window.speechSynthesis.speak(msg);
}
