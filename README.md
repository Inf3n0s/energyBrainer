<p align="center">
  <img alt="EnergyBrainer Logo" width="400" src="https://github.com/DoggoDev-0/energybrain/blob/main/assets/images/logo.png" />
</p>

# EnergyBrainer | Optimise your energy consume ☼  
## Project Documentation

### Introduction
This project involves setting up an ESP8266 board with a DHT11 sensor to report temperature and humidity data to an Express server. The data can be accessed through a mobile app called EnergyBrainer.

![Electrical Scheme using ESP8266 and DHT11 sensor](/assets/images/electrical-scheme.png "Electrical Scheme ")


### Android App
``` https://expo.dev/artifacts/eas/oDfnAHLe9LbCFfV68hZwbQ.apk ```
![Mobile app](https://i.imgur.io/I5ij2ip_d.webp?maxwidth=640&shape=thumb&fidelity=medium)

### Hardware Required
1. ESP8266 board
2. DHT11 temperature and humidity sensor
3. USB cable for ESP8266 board
4. Breadboard and jumper wires

### Software Required
1. Arduino IDE / VS Code
2. DHT sensor library for Arduino
3. EnergyBrainer app

### Wiring the ESP8266 and DHT11
- Connect the ESP8266 to the breadboard.
- Connect the DHT11 sensor to the breadboard.
- Connect the VCC pin of the DHT11 sensor to the 3.3V pin of the ESP8266.
- Connect the GND pin of the DHT11 sensor to the GND pin of the ESP8266.
- Connect the data pin of the DHT11 sensor to D7 pin of the ESP8266.

### Setting up ESP8266 Board
- Connect the ESP8266 board to your computer using a USB cable.
- Open the Arduino IDE and select the correct board and port in the "Tools" menu.
- Install the DHT sensor library for Arduino.
- Copy and paste the code **/energybrain/src/main.cpp** into the Arduino IDE:
- Replace **your_SSID** and **your_PASSWORD** with your WiFi network credentials.
- Upload the code to the ESP8266 board.

### Setting up your own server
- Install Node.js and NPM on your computer if you haven't already.
- Run ```git clone https://github.com/DoggoDev-0/energybrain.git```
- Open a command prompt or terminal and navigate to the ***express-temperature*** directory.
- Run the following command to install dependencies:```npm install```
- Run the following command to start the Express server:```npm run start```
