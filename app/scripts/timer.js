var xTimer;
var data = {
          0 : {note: 'Warm Up', audio: 'Warmup.'}, 
          1 : {note: 'Warm Up', audio: 'Warmup. One more minute.'}, 
          2 : {note: '6', audio: '6'}, 
          3 : {note: '7', audio: '7'}, 
          4 : {note: '8', audio: '8'}, 
          5 : {note: '9 HIGH POINT', audio: '9. High Point.'}, 
          6 : {note: '6', audio: '6'}, 
          7 : {note: '7', audio: '7'}, 
          8 : {note: '8', audio: '8'}, 
          9 : {note: '9 HIGH POINT', audio:'9. High Point.'}, 
          10: {note: '6', audio: '6' }, 
          11: {note: '7', audio: '7'}, 
          12: {note: '8', audio: '8'}, 
          13: {note: '9 HIGH POINT', audio:'9. High Point.'}, 
          14: {note: '6', audio: '6'}, 
          15: {note: '7', audio: '7'}, 
          16: {note: '8', audio: '8'}, 
          18: {note: '9', audio: '9. High Point.'}, 
          19: {note: '10', audio:'10. Burn-it-out!.'}, 
          20: {note: 'Cool Down', audio: 'Cool down.'},
          21: {note: 'FINISH!', audio: 'Finished. Great workout!'}
        };
        

function initMinCookie(){
  if(!Cookies.get('time')) {
    Cookies.set('time', 0);
  }
}


$(document)
    .ready(function(){
      initMinCookie();
      setInterval(function(){
          var minIndex = getTime('mins');
          var secsInterval = getTime('secs');
          var stateInterval = Cookies.get('state')
          var textGoal = data[minIndex]['note'];
          $('#target-goal').text(textGoal);
          if(stateInterval == 'true' && getTime('secs') % 60 == 0){
            var index = getTime('mins')
            playAudio(data[index]);
            console.log('Total Mins: ' + index);
          }
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
        Cookies.set('mins', 0);
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

function getTime(minSec){
  if(minSec == 'mins'){
    return Math.floor(Cookies.get('time') / 60 / 1000) || 0;
  } else {
    return Math.floor(Cookies.get('time') / 1000) || 0;
  }
}

function playAudio(data) {
  var output = data['audio'];
  if(parseInt(output)){
    output = 'Level ' + output;
  }
  var msg = new SpeechSynthesisUtterance(output);
  window.speechSynthesis.speak(msg);
}
