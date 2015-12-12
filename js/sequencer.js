var audioContext = null;
var midiAccess;
var midiDevice;
var bpm = 128; //default beats per minute setting
var tempo; //tempo in 24ppq
var lookahead = 25.0; // How frequently to call scheduling function (ms)
var scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
var nextClockTime = 0.0; // when the next note is due.
var startTime = 0;
var playPressed = false;
var isPlaying = false;
var beatCounter = 0; // Tracks beats in 24ppq, so up to 192 for 8 steps
var beatDiv = 8; // Divisons of the beat to play
var stepNum = 0; // Tracks current step (up to 8 steps by default)

//Midi note mappings
var notes = {
'G9':'127','F#9':'126','F9':'125','E9':'124','D#9':'123',
'D9':'122','C#9':'121','C9':'120','B8':'119','A#8':'118',
'A8':'117','G#8':'116','G8':'115','F#8':'114','F8':'113',
'E8':'112','D#8':'111','D8':'110','C#8':'109','C8':'108',
'B7':'107','A#7':'106','A7':'105','G#7':'104','G7':'103',
'F#7':'102','F7':'101','E7':'100','D#7':'99','D7':'98',
'C#7':'97','C7':'96','B6':'95','A#6':'94','A6':'93',
'G#6':'92','G6':'91','F#6':'90','F6':'89','E6':'88',
'D#6':'87','D6':'86','C#6':'85','C6':'84','B5':'83',
'A#5':'82','A5':'81','G#5':'80','G5':'79','F#5':'78',
'F5':'77','E5':'76','D#5':'75','D5':'74','C#5':'73',
'C5':'72','B4':'71','A#4':'70','A4':'69','G#4':'68',
'G4':'67','F#4':'66','F4':'65','E4':'64','D#4':'63',
'D4':'62','C#4':'61','C4':'60','B3':'59','A#3':'58',
'A3':'57','G#3':'56','G3':'55','F#3':'54','F3':'53',
'E3':'52','D#3':'51','D3':'50','C#3':'49','C3':'48',
'B2':'47','A#2':'46','A2':'45','G#2':'44','G2':'43',
'F#2':'42','F2':'41','E2':'40','D#2':'39','D2':'38',
'C#2':'37','C2':'36','B1':'35','A#1':'34','A1':'33',
'G#1':'32','G1':'31','F#1':'30','F1':'29','E1':'28',
'D#1':'27','D1':'26','C#1':'25','C1':'24','B0':'23',
'A#0':'22','A0':'21','G#0':'20','G0':'19','F#0':'18',
'F0':'17','E0':'16','D#0':'15','D0':'14','C#0':'13',
'C0':'12'
};

var currentNote = null; //currently playing note

//Actions to perform on load
window.addEventListener('load', function() {
    //load button icons
    $('#play').html("<i class=\"fa fa-stop\"></i>");
    $('#play').html("<i class=\"fa fa-play\"></i>");
    $('#octaveUpAll').html("<i class=\"fa fa-chevron-up\"></i>");
    $('#octaveDownAll').html("<i class=\"fa fa-chevron-down\"></i>");
    //Prevent swipe down to refresh in Android Chrome 
    var lastTouchY = 0;
    var touchstartHandler = function(e) {
    if (e.touches.length != 1) return;
    lastTouchY = e.touches[0].clientY;
    maybePreventPullToRefresh =
        preventPullToRefreshCheckbox.checked &&
        window.pageYOffset == 0;
    }

    var touchmoveHandler = function(e) {
        var touchY = e.touches[0].clientY;
        var touchYDelta = touchY - lastTouchY;
        lastTouchY = touchY;

        if (touchYDelta > 0) {
            e.preventDefault();
            return;
        }
    }

    document.addEventListener('touchstart', touchstartHandler, false);
    document.addEventListener('touchmove', touchmoveHandler, false);

    //set button press functions
    $('#play').click(play);
    $('#octaveUpAll').click(octaveUpAll);
    $('#octaveDownAll').click(octaveDownAll);
    $('[id^=octUp]').click(octaveUpSingle);
    $('[id^=octDown]').click(octaveDownSingle);
    document.getElementById("octaveUpAll").addEventListener("touchend", function(e) {
      e.preventDefault();
      octaveUpAll();
    }, false);
    document.getElementById("octaveDownAll").addEventListener("touchend", function(e) {
      e.preventDefault();
      octaveDownAll();
    }, false);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    //skin the midi device select dropdown
    $('.selectpicker').selectpicker();
    //initialize BPM range selector list and set default BPM
    createBPMOptions(document.getElementById("bpm"));
    $('#bpm').val(128);
    document.getElementById("bpm").onchange = changeBPM;
    document.getElementById("division").onchange = changeDivision;

    //initialize the note selectors
    createNoteOptions();
    //set the default selected note
    $("[id^=note]").val('24');

    //skin the select dropdowns
    $('#bpm').iPhonePicker({ width: '50px', imgRoot: 'images/' });
    $('#division').iPhonePicker({ width: '50px', imgRoot: 'images/' });
    $("[id^=note]").iPhonePicker({ width: '35px', imgRoot: 'images/' });

    //remove focus from Play button
    $('#play').focus(function() {
        this.blur();
    });

    //try to access midi and handle the events
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
});

// Request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

//If request MIDI access succeeded, set the select box options.
function onMIDISuccess(midi) {
    midiAccess = midi;
    console.log('MIDI Access Object', midiAccess);
    selectMIDIOut = document.getElementById("midiOut");
    selectMIDIOut.onchange = changeMIDIOut;
    selectMIDIOut.options.length = 0;

    //calculate the MIDI clock (24ppq)
    tempo = 60 / bpm / 24;

    //loop through midi devices and initialize midi device selector
    var outputs = midiAccess.outputs.values();
    var deviceFound = false;
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {

        selectMIDIOut.appendChild(new Option(output.value.name, output.value.id, false, false));

        if (!deviceFound) {
            //set the initial midi device object to the first device found
            midiDevice = output.value;
            deviceFound = true;
        } 
    }

    if (!deviceFound) {
        document.getElementById("midiOut").appendChild(new Option("No Device Available", 0, false, false));
        $('#play').addClass('disabled');
    }
}

//If request MIDI access failed, log message
function onMIDIFailure(e) {
    document.getElementById("midiOut").appendChild(new Option("No Device Available", 0, false, false));
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API." + e);
}

//Event handler for when midi device picker was changed
function changeMIDIOut(e) {
    var id = e.target[e.target.selectedIndex].value;
    if ((typeof(midiAccess.outputs) == "function")) {
        midiDevice = midiAccess.outputs()[e.target.selectedIndex];
    } 
    else {
        midiDevice = midiAccess.outputs.get(id);
    }
    if (midiDevice && e.target[e.target.selectedIndex] != "No Device Available") {
        $('#play').removeClass('disabled');
    }
}

//Event handler for when BPM picker was changed
function changeBPM(e) {
    bpm = e.target[e.target.selectedIndex].value;
    tempo = 60 / bpm / 24;
}

//Event handler for beat divison selector update
function changeDivision() {
    beatDiv = $('#division').val();
}

//Start the MIDI sequencer clock: Send a Clock Start signal first, 
//then keep sending Clock signals in tempo
function play() {
    if ($('#play').hasClass("disabled")) {
        window.alert("A midi device must be selected in order to play the sequencer.");
        return;
    }
    $('#play').toggleClass("red blue");
    $('#play').focus(function() {
        this.blur();
    });
    if (isPlaying) {
        //toggle icon to arrow
        $('#play').html("<i class=\"fa fa-play\"></i>");
        $('#status').text("Stopped");
        isPlaying = false;
        stop();
    }
    else {
        playPressed = true;
        isPlaying = true;
        //toggle icon to square
        $('#play').html("<i class=\"fa fa-stop\"></i>");
        $('#status').text("Playing...");
        nextClockTime = 0;
        tempo = 60 / bpm / 24;
        startTime = audioContext.currentTime + 0.005;
        scheduleClock();
    }
}

//Stops the MIDI clock
function stop() {
    midiDevice.send([0xFC]);
    window.clearTimeout(timerID);
}

//schedules when the next clock should fire
function scheduleClock() {
    var currentTime = audioContext.currentTime;
    currentTime -= startTime;

    while (nextClockTime < currentTime + scheduleAheadTime) {
         if (playPressed) {
               setTimeout(function() {
                //send midi clock start only the first beat! 
                //timeout needed to avoid quick first pulse
                playPressed = false;
                midiDevice.send([0xFA]);
                midiDevice.send([0xF8]);
            }, currentTime + nextClockTime);
         }
        advanceClock();
    }
    timerID = window.setTimeout("scheduleClock()", 0);
}

//move the clock forward by tempo intervals (24ppq)
function advanceClock() {
    //send midi clock signal
    midiDevice.send([0xF8]);
    //advance beat
    beatCounter++;
    if (beatCounter >= 192) {
        beatCounter = 0;
    }

    //calculate divisions per step
    if (beatCounter % beatDiv == 0) {
        stepNum++;
        if (stepNum >= 8) {
            stepNum = 0;
        }
        if (currentNote) {
            //turn off current note playing
            midiDevice.send([0x80, currentNote, 0x40]);
        }
        
        //send the current note
        currentNote =  $("#note" + stepNum).val();
        midiDevice.send([0x90, currentNote, 0x7f]);
    }
    //the next clock will be at the next tempo marker
    nextClockTime += tempo;
}

function octaveUpAll() {
    $("[id^=note]").each(function() {
        if (this.selectedIndex - 12 >= 0) {
            this.selectedIndex -= 12;
        }
        else {
            this.selectedIndex = 0;
        }
    });
    $("[id^=note]").iPhonePickerRefresh();

}

function octaveDownAll() {
    $("[id^=note]").each(function() {
        if (this.selectedIndex + 12 < this.options.length) {
            this.selectedIndex += 12;
        }
        else {
            this.selectedIndex = this.options.length - 1;
        }
    });
    $("[id^=note]").iPhonePickerRefresh();

}

function octaveUpSingle() {
    var noteIndex = this.id.replace('octUp', "");
    $("#note" + noteIndex).each(function() {
        if (this.selectedIndex - 12 >= 0) {
            this.selectedIndex -= 12;
        }
        else {
            this.selectedIndex = 0;
        }
    });
    $("#note" + noteIndex).iPhonePickerRefresh();

}

function octaveDownSingle() {
    var noteIndex = this.id.replace('octDown', "");
    $("#note" + noteIndex).each(function() {
        if (this.selectedIndex + 12 < this.options.length) {
            this.selectedIndex += 12;
        }
        else {
            this.selectedIndex = this.options.length - 1;
        }
    });
    $("#note" + noteIndex).iPhonePickerRefresh();

}

//Helper function to create the BPM list
function createBPMOptions(select) {
    for (var i = 60; i < 200; i++) {
        createBPMOption(select,i);
    }
}

//populate the note dropdowns
function createNoteOptions() {
    var selects = $('[id^=note]');
    for (var i = 0; i < selects.length; i++) {
        for(var key in notes) {
          createNoteOption(selects[i], key);
        }
    }
}

//helper function to create a select control option for Notes
function createBPMOption(select, key) {
    var option = document.createElement('option');
    option.innerHTML = key;
    option.value = key;
    select.appendChild(option);
}

//helper function to create a select control option for Notes
function createNoteOption(select, key) {
    var option = document.createElement('option');
    option.innerHTML = key;
    option.value = notes[key];
    select.appendChild(option);
}