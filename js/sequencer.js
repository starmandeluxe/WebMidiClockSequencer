var midiAccess;
var midiDevice;
var bpm = 120;
var tempo;
var interval;

//Actions to perform on load
window.addEventListener('load', function() {
    //initialize BPM range selector list and set default BPM
    createBPMOptions(document.getElementById("bpm"));
    document.getElementById("bpm").selectedIndex = 68;
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
    tempo = 60000.0 / bpm / 24;


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
    tempo = 60000.0 / bpm / 24;
}

//Start the MIDI sequencer clock: Send a Clock Start signal first, 
//then keep sending Clock signals in tempo
function play() {
    if (interval) {
        clearInterval(interval);
    }
    midiDevice.send( [0xFA] );
    interval = setInterval(function() {
         midiDevice.send( [0xF8] );
     }, tempo);
}

//Stops the MIDI clock
function stop() {
    midiDevice.send( [0xFC] );
    clearInterval(interval);
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