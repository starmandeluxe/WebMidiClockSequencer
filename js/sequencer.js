window.addEventListener('load', function() {
    createOptions(document.getElementById("bpm"));
    document.getElementById("bpm").value = 128;
    $('#bpm').iPhonePicker({ width: '80px', imgRoot: 'images/' });
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
});
var midiAccess;
var midiDevice;
var bpm = 120;
var tempo;
var interval;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article. 
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midi) {
    midiAccess = midi;
    // when we get a succesful response, run this code
    console.log('MIDI Access Object', midiAccess);
    selectMIDIOut = document.getElementById("midiOut");
    selectMIDIOut.onchange = changeMIDIOut;
    selectMIDIOut.options.length = 0;

    document.getElementById("bpm").onchange = changeBPM;
    tempo = 60000.0 / bpm / 24;



    var outputs = midiAccess.outputs.values();
    var deviceFound = false;
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
        
        selectMIDIOut.appendChild(new Option(output.value.name, output.value.id, false, false));

        if (!deviceFound) {
            midiDevice = output.value;
        }

        deviceFound = true;
    }

    $('#midiOut').iPhonePicker({ width: '200px', imgRoot: 'images/' });

    console.log('Output ', output);
}

function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function changeMIDIOut(e) {
    var id = e.target[e.target.selectedIndex].value;

    if ((typeof(midiAccess.outputs) == "function")) {
        midiDevice = midiAccess.outputs()[e.target.selectedIndex];
    } else {
        midiDevice = midiAccess.outputs.get(id);
    }
}

function changeBPM(e) {
    bpm = e.target[e.target.selectedIndex].value;
    tempo = 60000.0 / bpm / 24;
}

function play() {
    if (interval) {
        clearInterval(interval);
    }
    midiDevice.send( [0xFA] );
    interval = setInterval(function() {
         midiDevice.send( [0xF8] );
     }, tempo);
}

function stop() {
    midiDevice.send( [0xFC] );
    clearInterval(interval);
}

function createOptions(select) {
    for (var i = 60; i < 200; i++) {
        createOption(select,i);
    }
}

function createOption(select, num) {
  var option = document.createElement('option');
  option.text = num;
  option.value = num;
  select.add(option);
}