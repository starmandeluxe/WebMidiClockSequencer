var audioContext = null;
var midiAccess;
var midiDevice;
var bpm = 120;
var tempo;
var scheduler;

var lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
var nextClockTime = 0.0;     // when the next note is due.
var startTime = 0;
var playFlag = false;

//Actions to perform on load
window.addEventListener('load', function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    //initialize BPM range selector list and set default BPM
    createBPMOptions(document.getElementById("bpm"));
    document.getElementById("bpm").value = 128;
    document.getElementById("bpm").onchange = changeBPM;
    $('#bpm').iPhonePicker({ width: '80px', imgRoot: 'images/' });
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
    }

    //style the picker
    $('#midiOut').iPhonePicker({ width: '200px', imgRoot: 'images/' });

    console.log('Output ', output);
}

//If request MIDI access failed, log message
function onMIDIFailure(e) {
    document.getElementById("midiOut").appendChild(new Option("No Device", 0, false, false));
    $('#midiOut').iPhonePicker({ width: '200px', imgRoot: 'images/' });
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API." + e);
}

//Event handler for when midi device picker was changed
function changeMIDIOut(e) {
    var id = e.target[e.target.selectedIndex].value;
    if ((typeof(midiAccess.outputs) == "function")) {
        midiDevice = midiAccess.outputs()[e.target.selectedIndex];
    } else {
        midiDevice = midiAccess.outputs.get(id);
    }
}

//Event handler for when BPM picker was changed
function changeBPM(e) {
    bpm = e.target[e.target.selectedIndex].value;
    tempo = 60 / bpm / 24;
}


//Start the MIDI sequencer clock: Send a Clock Start signal first, 
//then keep sending Clock signals in tempo
function play() {
    playFlag = true;
    nextClockTime = 0;
    tempo = 60 / bpm / 24;
    startTime = audioContext.currentTime + 0.005;
    //midiDevice.send([0xF8]);
    //window.clearTimeout(timerID);
    scheduleClock();
}

//Stops the MIDI clock
function stop() {
    midiDevice.send([0xFC]);
    window.clearTimeout(timerID);
}


function scheduleClock() {
    var currentTime = audioContext.currentTime;
    currentTime -= startTime;
    while (nextClockTime < currentTime + scheduleAheadTime) {
        if (playFlag) {
            setTimeout(function() {
                playFlag = false;
                midiDevice.send([0xFA]);
                midiDevice.send([0xF8]);
            }, currentTime + nextClockTime);   
        }
        else {
            midiDevice.send([0xF8]);
        }
        advanceClock();
    }
    timerID = window.setTimeout("scheduleClock()", 0);
}

function advanceClock() {
    nextClockTime += tempo;
}


//Helper function to create the BPM list
function createBPMOptions(select) {
    for (var i = 60; i < 200; i++) {
        createOption(select,i);
    }
}

//helper function to create a select control option
function createOption(select, num) {
  var option = document.createElement('option');
  option.text = num;
  option.value = num;
  select.add(option);
}