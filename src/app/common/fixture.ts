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

## Introduction
This tutorial will show you how to integrate your roller shutter into your home automation system. 
With each chapter, we will increase the level of integration. 
Since every chapter will provide an applicable result, you don't have to finish the whole tutorial. 
But if you you do, you will have a fully integrated roller shutter, that can be scheduled via home assistant. 
You will be able to automatically set the shutter to a certain level at a certain time. See the following example:

### Example: My own Shutter Automation
- In the evening it autmatically closes at sunset time. 
- In the morning the shutter is opened to 50%. So we can wake up with sunlight. 
- 2 hours later - when everybody left the home - it is opened fully. 

Additionally I can always set the shutter level manually with a poti controller, that is mounted to the wall.


## Basics: Shutter Motors

The only requirement for automating your roller shutter is a tubular shutter motor that is installed in the shutter axis. 
Despite of the neutral- and the ground conductors, there are two phase conductors. 
One for moving the shutter up- and one for moving it down. 
By applying voltage on one of these phases, the motor starts rotating with constant speed in the corresponding direction.
(We will use this fact for estimating the current state of the shutter at Integration Level 3).


## Integration Level 1: Control the Shutter with a Remote Switch
### Required Hardware Components: 
- 433Mhz receiver for motor control https://www.amazon.de/-/en/gp/product/B07GXWWM9G/
- 433Mhz transmitter switch https://www.amazon.de/dp/B077RZZGS1/ref=cm_sw_em_r_mt_dp_ZB3DYS8NHCPRQ781RETJ

The first step is to connect the 433Mhz receiver to the motor and control it with a remote switch. 
As described in the basics section, the motor has two phase wires (one for UP, one for DOWN), a neutral- and a ground wire. 
**Caution: Before working on the wires, turn off the power!**
Now each of these wires can be connected to the receiver by attaching it to the corresponding socket in the green area (see image).
The sockets in the blue area can optionally be used for applying a manual wall switch.

When every wire is connected (and isolated), we can turn on the power, again. 
Finally you have to couple the remote switch to the receiver by
pressing the connect button - the LED starts flashing - , and by pressing one of the "ON" buttons on 
the remote. The coupling was successful, when the LED stopps flashing.

When everything is set up correctly, you are now able to control the motor with the remote. 
By pressing either ON or OFF on the remote you will hear the clicking of a relay, and the motor will start moving in the corresponding direction.

<img src="/assets/schema_1.png" alt="drawing" width="500"/>


## Integration Level 2: Control the Shutter with an Arduino and a Poti
### Required Hardware Components: 
- 433 Mhz sender https://www.amazon.de/dp/B07MY39VF8/ref=cm_sw_em_r_mt_dp_HZN8TG8RCR8E5B8KNRDV
- Arduino microcontroller https://www.amazon.de/-/en/dp/B01MS7DUEM/ref=twister_B07ZD346G2

Having a remote switch for controlling the motor is already a useful solution. 
Still there are some drawbacks: First: the remote can't be integrated into an automation system. 
And second: For setting the shutter to a certain height, we have to do this manually by pressing and releasing the button for the right duration. 
We will now solve this problem by replacing the remote with an Arduino and a 433 Mhz sender. 
Additionally we will add a poti for setting the desired height of the shutter. 

### Sniffing Remote Commands with Arduino

For replacing the remote, we have to imitate it. 
Therefore we have to sniff the values that are sent when "ON" or "OFF" are pressed. 
This is done as follows:
1. Connect your Arduino via USB and make sure that everything is set up properly, so that you can compile and upload your own sketches to the micro controller. If you have problems here, you can follow e.g. this tutorial https://www.arduino.cc/en/Guide
2. Install the library RCSwitch in your Arduino IDE. You can do this inside the Arduino IDE with the 'Library Manager'
3. Connect the D2 connector with the data connector of the 433 Mhz sender. Also connect VCC to 5V, and GND to GND. See the foto for an example: 
4. Copy & paste the following code into the IDE or open the file in this repository: 

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

Voilà! Now we know the commands for remote control of the motor. The sniffer is not required anymore.

### Build a Poti controller 433 Mhz Sender 

Before we install the final software on the Arduino, let us first set up the hardware. 
Connect GND to GND and VCC to 5V for both, the poti and the sender. 
Also connect the data connector of the sender to D7 and the remaining poti connector to A0. 
See the sketch for an example: 


### Installation and Callibration of the Software

The final step in this section is to install the software, and to provide some configuration values.

1. Clone my github project to your local machine
2. Open the \`shutter_remote_controller/shutter_remote_controller.ino\` in Arduino IDE.
3. Open the tab \`config.h\`
4. Assign the binary numbers that you sniffed previously to the variables \`RF433_UP\` and \`RF433_DOWN\`.
5. Measure the required time for opening and closing the shutter completely, and assign the values to the variables \`SECS_ROLL_UP\` and \`SECS_ROLL_DOWN\`.

The resulting config.h should look similar to this: 
\`\`\`
// --- config ---

#define N                        4     // the number of sensor readings, that are stored in the history
#define DELAY                    200
#define HIST_SIZE                2     // the number of old    readings, that are used to determine, if the sensor state has changed. (requirement N > HIST_SIZE + ACTL_SIZE)
#define ACTL_SIZE                2     // the number of actual readings, that are used to determine, if the sensor state has changed. (requirement N > HIST_SIZE + ACTL_SIZE)
#define DIRECTN_SIZE             12    // the number of directn commands, that are used to determine, if the system has a command cycle (shutter goes up and down repeatedly)
#define STOP_CYCLE_THRESHOLD     3     // the number of repeated STOP-directn-commands, to break the stop-cycle
#define RF24_ENABLE              1
#define RF24_MAX                 1500
#define POTI_MAX                 1023  // max value of the POTI // schlafzimmer: 3280, prototyp: 4095
#define POTI_MIN                 0
#define RF433_PULSE_LENGTH       200
#define RF433_PROTOCOL           2
#define RF433_UP                 "10101000001010110101011000000000"
#define RF433_DOWN               "10100000001010110101011000000000"
#define THRESHOLD_POTI           0.015  // the tolerance for the poti. A change of the poti value is only observed, when the difference to the new value exceeds the tolerance
#define THRESHOLD_RF24           0.05   // the percentual change of the RF24 value, at which a shutter (Rollladen) activity is triggered
#define THRESHOLD_MOVE_MOTOR     0.01  // the percentage of the difference of the target at which the motor should be activated
#define SECS_ROLL_UP             21    // the amount of seconds the motor takes to roll up the shutter
#define SECS_ROLL_DOWN           22    // the amount of seconds the motor takes to roll down the shutter
#define THRESHOLD_OVERSHOOT_UP   0.98  // the threshold at which the shutter is pulled up additionally for some seconds
#define SECS_OVERSHOOT_UP        3     // the seconds that the shutter is pulled up additionally, when the position reached THRESHOLD_OVERSHOOT_UP
#define THRESHOLD_OVERSHOOT_DOWN 0.02  // the threshold at which the shutter is pulled down additionally for some seconds
#define SECS_OVERSHOOT_DOWN      3     // the seconds that the shutter is pulled up additionally, when the position reached THRESHOLD_OVERSHOOT_UP


byte PIN_RF24_CE     = 9;
byte PIN_RF24_CSN    = 10;
byte PIN_RELAIS_UP   = 4;
byte PIN_RELAIS_DOWN = 5;
byte PIN_POTI        = A0;
byte PIN_RF433       = 7;


// --- setup ---

enum motor_direction { STOPPED, DOWN, UP, STOP, CYCLE_BREAK}; 
enum sensor          { POTI, RF_24 };
\`\`\`


Now we will 

## Integration Level 3: Control the Shutter with a Raspberry Pi and Python
### Required Hardware Components: 
- NRF24L01 transceiver https://www.amazon.de/AZDelivery-NRF24L01-wireless-modules-Raspberry/dp/B075DBDS3J
- Raspberry Pi mini computer https://www.amazon.de/-/en/Raspberry-1373331-Model-Motherboard-1GB/dp/B07BFH96M3/
- SD Card https://www.amazon.de/-/en/SanDisk-Ultra-microSDHC-memory-adapter/dp/B073JWXGNT 

## Integration Level 4: Control the Shutter with a Raspberry Pi and Home Assistant


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