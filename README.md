# Web Midi Clock Sequencer
A simple clock output sequencer for Web Midi API

#Synopsis
This is a sample project to demonstrate the Web Midi API's MIDI OUT functionality. It will detect MIDI devices connected via USB (or internal MIDI devices) and output a clock based on a set BPM (Beats Per Minute). 

Update: I have added MIDI note output functionality in an 8-step sequencer loop!

Tested on Google Chrome 46.0.2490.71 m and Chrome for Android via USB OTG (see Issues section for details)

You can access the sequencer here: http://www.alexkort.com/ClockSequencer/

#Usage
1. Connect your slave device's (drum machine, synthesizer, etc.) MIDI IN port to your MIDI interface's MIDI OUT port.
2. Connect your MIDI interface to your device (USB or OTG). Load the browser page that this application is running on. 
2. Select the device in the selector wheel as well as a desired BPM in the second selector wheel.
3. Press the Play button. MIDI Clock Start and clock signals will be sent to your specified output interface.
4. Press the Stop button to stop the MIDI Clock from sending output signals. 
5. Using the Beat Divider scroller, select the rate that you want the step sequencer to run in relation to the clock.
6. In the 8 note scrollers, select any note to output.

#Issues
- Changing to another tab in Chrome will cause problems with the clock timing. It is recommended to run this in a separate window.
- On Chrome for Android 6.0 Marshmallow via USB OTG and a Komplete Audio 6 MIDI interface, the clock output is unstable. I am currently investigaging the root cause.
