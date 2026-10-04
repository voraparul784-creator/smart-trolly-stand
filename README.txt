SMART TROLLEY – LIVE STAND MONITORING WEBSITE
===============================================

FILES
-----
index.html  = website
style.css   = design
script.js   = live dashboard + Web Serial + demo mode
arduino/Smart_Trolley_Stand_Monitor.ino = Arduino UNO code

SYSTEM
------
10 IR sensors -> Arduino UNO -> USB cable -> Chrome/Edge -> Website

DATA FORMAT
-----------
Arduino sends one line every 500 ms:
T:1,0,1,1,0,0,1,0,1,1

1 = trolley present
0 = trolley absent

HARDWARE
--------
Arduino UNO
10 x LM393 IR obstacle/IR sensor modules
USB cable
Computer running Chrome or Microsoft Edge

IR WIRING
---------
Every IR sensor:
VCC -> Arduino 5V
GND -> Arduino GND
OUT -> Arduino pins D2-D11 (one sensor per pin)

IMPORTANT
---------
Do NOT power many sensors from an unstable 5V source. For a 10-sensor prototype, use a stable 5V supply if required, with common GND.
Keep the USB connected while using Web Serial.

HOW TO RUN
----------
1. Open index.html in Google Chrome or Microsoft Edge.
2. Click "Connect Arduino".
3. Select the Arduino UNO serial port.
4. The dashboard becomes live.
5. If you do not have Arduino connected yet, click "Demo Mode".

If Chrome blocks Web Serial from a local file on your PC, run a tiny local server:
- Open Command Prompt in this folder.
- Run: python -m http.server 8000
- Open: http://localhost:8000
- Then click Connect Arduino.

SCIENCE EXHIBITION UPGRADE IDEAS
--------------------------------
- Add a stand number/QR code for every trolley location.
- Add "Last seen" time.
- Add total trolley capacity.
- Add an alarm when a stand stays empty for a selected time.
- Add a second Arduino or ESP32 for more stands / wireless networking.
- Add a physical LED at each stand.
- Add a history chart showing trolley availability over time.
