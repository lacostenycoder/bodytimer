
var xTimer;

$(document)
    .ready(function(){
        var cookieName = data.userId + "_" + data.patientId + "_" + data.monthId

        xTimer = new clsStopwatch(parseInt(Cookies.get("time_" +cookieName)||0), {
            onStart: function() {
                Cookies.set("state_" +cookieName, true)
                $('#time, #clock-icon').addClass('active')
            },
            onStop: function() {
                Cookies.set("state_" +cookieName, false)
                $('#time, #clock-icon').removeClass('active')
            },
            onReset: function() {
                $('#startClock').removeAttr('disabled')
                $('#time').html(this.timeFormatted(true));
            },
            onUpdate: function() {
                $('#time').html(this.timeFormatted(true));
                Cookies.set("time_" +cookieName, xTimer.time())
            }
        });

        $('#time').html(xTimer.timeFormatted(true));
        if(Cookies.get("state_" +cookieName)=='true')
            xTimer.start();
    })
    .on('click', '#startClock', function() {
        if(xTimer.time() == 0) {
            if (confirm('Notice: Do not log CCM time if "Face-to-Face" with the patient!  Proceed now?')) {
                xTimer.start();
            } else {
                xTimer.stop();
                xTimer.reset();
            }
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
    .on('click', 'button.member-question', function() {
        xTimer.stop();
        xTimer.reset();
        $('#utility-timer').hide(); // hide timer if patient assessment.
    })

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
