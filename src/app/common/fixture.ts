import { Entry } from './entry';

export const fixture: Entry[] = [
  {
    title: "Shutter Automation with Arduino and Raspberry Pi",
    date: "morgen",
    content: `
# Shutter Automation with Arduino and Raspberry Pi

**WARNING: THIS PROJECT INVOLVES HIGH VOLTAGES THAT CAN CAUSE SERIOUS INJURY OR DEATH. 
PLEASE TAKE ALL NECESSARY PRECAUTIONS, AND TURN OFF ALL POWER TO A CIRCUIT BEFORE WORKING ON IT. 
IF YOU DON'T KNOW WHAT YOU ARE DOING, DO YOURSELF A FAVOR AND LET IT BE.**

# Introduction
This tutorial will show you how to integrate your roller shutter into your home automation system. 
With each chapter, we will increase the level of integration. 
Since every chapter will provide an applicable result, you don't have to finish the whole tutorial. 
But if you you do, you will have a fully integrated roller shutter, that can be scheduled via Home Assistant. 
You will be able to automatically set the shutter to a certain level at a certain time. See the following example:

## Example: My own Shutter Automation
- In the evening it autmatically closes at sunset time. 
- In the morning the shutter is opened to 50%. So we can wake up with sunlight. 
- 2 hours later - when everybody left the home - it is opened fully. 

Additionally I can always set the shutter level manually with a poti controller, that is mounted to the wall.


# Basics: Shutter motors


The only requirement for automating your roller shutter is a tubular shutter motor that is installed in the shutter axis. 
Despite of the neutral- and the ground conductors, there are two phase conductors. 
One for moving the shutter up- and one for moving it down. 
By applying voltage on one of these phases, the motor starts rotating with constant speed in the corresponding direction.
(We will use this fact for estimating the current state of the shutter at Integration Level 3).


# Integration level 1: Control the shutter with a remote switch

This is the first step in this tutorial. We will now connect motor with a radio receiver and control it with a remote switch. 
This step will also provide the foundation for further integration in the subsequent sections.

### Required hardware components: 

- <a href="https://www.amazon.de/-/en/gp/product/B07GXWWM9G/">433Mhz receiver</a> Receives commands via 433 Mhz and controls the motor with relays
- <a href="https://www.amazon.de/dp/B077RZZGS1/ref=cm_sw_em_r_mt_dp_ZB3DYS8NHCPRQ781RETJ">433Mhz remote switch</a> Sends commands via 433 Mhz  to control the motor. 

We begin by connecting the 433Mhz receiver to the motor. 
As described in the basics section, the motor has two phase wires (one for UP, one for DOWN), a neutral- and a ground wire. 
**Caution: Before working on the wires, turn off the power!**
Now each of these wires can be connected to the receiver by attaching it to the corresponding socket in the green area (see image).
The sockets in the blue area can optionally be used for applying a manual wall switch.

When every wire is connected (and isolated), we can turn on the power, again. 
Finally you have to couple the remote switch to the receiver by
pressing the connect button - the LED starts flashing - , and by pressing one of the "ON" buttons on 
the remote. The coupling was successful, when the LED on the receiver stopps flashing.

<img src="/assets/schema_remote.png" alt="drawing" width="500"/>

When everything is set up correctly, you are now able to control the motor with the remote. 
By pressing either ON or OFF on the remote you will hear the clicking of a relay, and the motor will start moving in the corresponding direction.


# Integration level 2: Control the shutter with an arduino and a poti

Having a remote switch for controlling the motor is already a useful solution. 
Still there are some drawbacks: First: the remote can't be integrated into an automation system. 
And second: For setting the shutter to a certain height, we have to do this manually by pressing and releasing the button for the right duration. 
We will now solve this problem by replacing the remote with an Arduino and a 433 Mhz sender. 
Additionally we will add a poti for setting the desired height of the shutter. 

### Required Hardware Components: 
- <a href="https://www.amazon.de/-/en/dp/B01MS7DUEM/ref=twister_B07ZD346G2">Arduino microcontroller</a> By uploading our own custom C programs, we can send/read data via GPIO. First we'll use it for sniffing the commands from the remote, then we'll use it for controlling the shutter.
- <a href="https://www.amazon.de/dp/B07MY39VF8/ref=cm_sw_em_r_mt_dp_HZN8TG8RCR8E5B8KNRDV">433 Mhz sender</a> Used by the Arduino for sending 433 Mhz commands to the receiver. 
- <a href="https://www.amazon.de/-/en/Aussel-Linear-Potentiometer-Terminal-Rotary/dp/B0734K6WYP/">B10k Linear Potentiometer</a> We'll use this to set the desired height of the shutter.

But before we can start, we have to do some preliminary work.

## Sniffing radio commands with Arduino

For replacing the remote we have to imitate it by sending the same values.
Therefore we will now build a little radio sniffer.
This is done as follows:
1. Connect your Arduino via USB and make sure that everything is set up properly, so that you can compile and upload your own sketches to the micro controller. If you have problems here, you can follow e.g. this tutorial https://www.arduino.cc/en/Guide
2. Install the library RCSwitch. You can do this inside the Arduino IDE with the 'Library Manager'.
3. Connect the D2 connector with the data connector of the 433 Mhz sender. Also connect VCC to 5V, and GND to GND (see the following schema). 
Note: You may want to use jumper cables for the wiring, since you might want to reuse the Arduino as remote controller in the next step.

<br>

<img src="/assets/schema_sniffer.png" alt="drawing" width="500"/>

<br>

4. Now that everything is wired up, we install the sniffing software on the Arduino. 
Copy & paste the following code into the IDE or open the file in this repository: 

<br>


\`\`\`C
#include "RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>
RCSwitch mySwitch = RCSwitch();
void setup() {
 Serial.begin(9600);
 mySwitch.enableReceive(0);
}
void loop() {
 if (mySwitch.available()) {
 int value = mySwitch.getReceivedValue();
 if (value == 0) {
 Serial.print("Unknown encoding");
 } else {
 Serial.print("Received ");
 Serial.print( mySwitch.getReceivedValue() );
 Serial.print(" / ");
 Serial.print( mySwitch.getReceivedBitlength() );
 Serial.print("bit ");
 Serial.print("Protocol: ");
 Serial.println( mySwitch.getReceivedProtocol() );
 }
 mySwitch.resetAvailable();
 }
}
\`\`\`

<br>

5. Compile and upload the sketch to the Arduino.
5. In the Arduino IDE, open the Serial Monitor and press the "ON", "OFF" buttons on the remote.
6. The monitor should now print the received values from the remote. In my local example this looks as follows: 

<br>

\`\`\`
21:23:06.515 -> Received 2821412352 / 32bit Protocol: 2
21:23:07.184 -> Received 2687194624 / 32bit Protocol: 2
\`\`\`

<br>

7. Convert these values into binaries. You can use some online converter for this. The resulting values should be 32 bit numbers. 
E.g. 2821412352 becomes 10101000001010110101011000000000

Voilà! Now we know the commands for remote control of the motor. 
Write them down! You will need them in the next step.
If you don't want to reuse the sniffer for another shutter later, you can now disassemble it (this is why you should use jumper cables).


## Build a poti-controlled, programmable 433 Mhz sender 

Before we install the final software on the Arduino, let us first set up the hardware. 
Connect GND to GND and VCC to 5V for both, the poti and the sender. 
Also connect the data connector of the sender to D7 and the remaining poti connector to A0. 
See the sketch for an example: 

<img src="/assets/schema_poti.png" alt="drawing" width="500"/>


## Installation and callibration of the software

The final step in this section is to install the software, and to provide some configuration values.

1. Clone my github project to your local machine
2. Open the \`shutter_remote_controller/shutter_remote_controller.ino\` in Arduino IDE.
3. Open the tab \`config_rf433.h\`
4. Assign the binary numbers that you sniffed previously to the variables \`RF433_UP\` and \`RF433_DOWN\`.

The resulting config_rf433.h should look similar to this: 
\`\`\`
...
// set this to the corresponding digital pin
byte PIN_RF433 = 7;

// The value that is sent for moving the shutter up.
// You have to sniff it from a remote control
#define RF433_UP "10101000001010110101011000000000" 

// The value that is sent for moving the shutter down.
// You have to sniff it from a remote control
#define RF433_DOWN "10100000001010110101011000000000" 
...
\`\`\`


5. Measure the required time for opening and closing the shutter completely 
6. Assign the values to the variables \`SECS_ROLL_UP\` and \`SECS_ROLL_DOWN\` in \`config_application.h\`

**Note:** The file \`config_application.h\` provides many other configuration properties, that you might have to adjust. 
Explaining each of these properties would require to explain the whole algorthm. 
This would exceed the scope of this tutorial and it is likely that the default values will just work.
But if you do have to adjust the other configuration properties, the code documentation provides some hints.  

Congratulations! You just built your own remote shutter controller. 
This set up is already quite useful since controlling the shutter with a poti is much more convenient than pressing a button for a certain amount of time. 
If you are not interessted in further integration you can now install your Arduino remote in a plastic box and mount it to the wall (maybe next to the light switch).
Otherwise, if you want to integrate the Arduino with a raspberry pi and Home Assistant, 
you will have to add another communication module to the Arduino. So you might want to wait with installing your device into a plastic box.

# Integration Level 3: Control the Shutter with a Raspberry Pi and Python

In this step we will set up a little single-board computer - a Raspberry Pi - and integrate it with the Arduino. 
We will set up a little flask server that is able to send a desired shutter height via an NRF24 module. 
The server itself will receive commands via a REST API. 
So in the end, the motor will be controlable over the network with http.

### Required Hardware Components: 
- <a href="https://www.amazon.de/-/en/Raspberry-1373331-Model-Motherboard-1GB/dp/B07BFH96M3/">Raspberry Pi mini computer</a> A little computer that is mainly used for DIY projects and education. It is cheap, consumes low amounts of power and provides GPIO for connecting low-level hardware componets. We will use it for sending data to the Arduino, and for hosting Home Assistant.
- <a href="https://www.amazon.de/AZDelivery-NRF24L01-wireless-modules-Raspberry/dp/B075DBDS3J">NRF24L01 transceiver</a> Communication module for sending/receiving digital data. We will use it for sending the target shutter height from the Pi to Arduino.
- <a href="https://www.amazon.de/-/en/SanDisk-Ultra-microSDHC-memory-adapter/dp/B073JWXGNT">SD Card</a> Used as disk for the Raspberry Pi.

# Integration Level 4: Control the Shutter with a Raspberry Pi and Home Assistant


https://www.hausautomatisierer.de/433-mhz-sniffer-mit-arduino-bauen
`
  },
  {
    date: "01.01.2001",
    title: "dummy",
    content: `
# h1 Dummy Article
add some markdown
        `
  },
]