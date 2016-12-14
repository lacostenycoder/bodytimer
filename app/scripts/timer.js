
var xTimer;
var lookupLevel = {
          0 : 'Warm Up', 
          1 : '6',
          2 : '7',
          3 : '8',
          4 : '9 - HIGH',
          5 : '6',
          6 : '7',
          7 : '8',
          8 : '9 - HIGH',
          9 : '6',
          10: '7',
          11: '8',
          12: '9 - HIGH',
          13: '6',
          14: '7',
          15: '8',
          16: '9',
          18: '10',
          19: 'Cool Down',
          20: 'FINISH!' 
        };
var currentMins;

$(document)
    .ready(function(){
      setInterval(function(){
          var currentMins;
          try {
            currentMins = Math.floor(Cookies.get('time') / 60 / 1000) || 0;
          } catch (e) {
            console.log(e);
            currentMins = 0;
          }
          var val = lookupLevel[currentMins];
          $('#target-goal').text(val);
      }, 100);
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
        var date = new Date(null);
        date.setTime(this.time())
        return date.toISOString().substr(include_hours ? 11 : 14, include_hours ? 8 : 5).replace(/\:(\d\d)$/,'<span>:</span>$1');
    };
};
