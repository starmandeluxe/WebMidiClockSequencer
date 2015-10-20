# Web Midi Clock Sequencer
A simple clock output sequencer for Web Midi API

#Synopsis
This is a sample project to demonstrate the Web Midi API's MIDI OUT functionality. It will detect MIDI devices connected via USB (or internal MIDI devices) and output a clock based on a set BPM (Beats Per Minute). Tested on Google Chrome 46.0.2490.71 m and Chrome for Android via USB OTG.

#Usage
1. Connect your midi interface to your device. Load the browser page that this application is running on. 
2. Select the device in the selector wheel as well as a desired BPM in the second selector wheel.
3. Press the Play button. MIDI Clock Start and clock signals will be sent to your specified output interface.
4. Press the Stop button to stop the MIDI Clock from sending output signals. 

#Issues
- Currently the timing is using Javascript's SetInterval, which is a bad practice for precise timing if any outside processing happens on the main thread. I need to refactor this solution to use the Web Audio Clock along with the Javascript timer to schedule events.
- Changing browser windows stops the Midi clock. This could be caused by the Javascript timer thread being suspended when focus is lost.

