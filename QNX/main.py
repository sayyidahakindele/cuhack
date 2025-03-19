import rpi_gpio as GPIO  # Import the QNX Raspberry Pi GPIO module for controlling GPIO pins
import time  # Import the time module for adding delays
from getSequenceCode import get_sequence
import socketio
import signal
import sys

sio = socketio.Client()

def signal_handler(sig, frame):
    print('You pressed Ctrl+C!')
    sio.disconnect()
    sys.exit(0)  # Exit gracefully

signal.signal(signal.SIGINT, signal_handler) #sets the signal handler

# Define GPIO pins for RGB LED
RED_PIN = 17   # GPIO pin for Red LED (pin 11)
GREEN_PIN = 27 # GPIO pin for Green LED (pin 13)
BLUE_PIN = 22  # GPIO pin for Blue LED (pin 15)
 
# Set up GPIO pins as output
GPIO.setup(RED_PIN, GPIO.OUT)
GPIO.setup(GREEN_PIN, GPIO.OUT)
GPIO.setup(BLUE_PIN, GPIO.OUT)
 

# Turns off all LEDs.
def turnOff():
    GPIO.output(RED_PIN, GPIO.LOW)
    GPIO.output(GREEN_PIN, GPIO.LOW)
    GPIO.output(BLUE_PIN, GPIO.LOW)
          
# Turns on only the red LED.
def red():
    GPIO.output(RED_PIN, GPIO.HIGH)
    GPIO.output(GREEN_PIN, GPIO.LOW)
    GPIO.output(BLUE_PIN, GPIO.LOW)

# Turns on only the green LED. 
def green():
    GPIO.output(RED_PIN, GPIO.LOW)
    GPIO.output(GREEN_PIN, GPIO.HIGH)
    GPIO.output(BLUE_PIN, GPIO.LOW)
     
# Turns on only the blue LED.
def yellow():
    GPIO.output(RED_PIN, GPIO.LOW)
    GPIO.output(GREEN_PIN, GPIO.LOW)
    GPIO.output(BLUE_PIN, GPIO.HIGH)

# Turns on red and green LEDs to produce yellow light.    
def black():
    GPIO.output(RED_PIN, GPIO.HIGH)
    GPIO.output(GREEN_PIN, GPIO.HIGH)
    GPIO.output(BLUE_PIN, GPIO.LOW)

# Turns on all LEDs to produce white light.
def white():
    GPIO.output(RED_PIN, GPIO.HIGH)
    GPIO.output(GREEN_PIN, GPIO.HIGH)
    GPIO.output(BLUE_PIN, GPIO.HIGH)
    
def newC1():
    GPIO.output(RED_PIN, GPIO.LOW)
    GPIO.output(GREEN_PIN, GPIO.HIGH)
    GPIO.output(BLUE_PIN, GPIO.HIGH)

def newC2():
    GPIO.output(RED_PIN, GPIO.HIGH)
    GPIO.output(GREEN_PIN, GPIO.LOW)
    GPIO.output(BLUE_PIN, GPIO.HIGH)

def getSequence():
  try:
    from getSequenceCode import get_sequence
  
  except Exception as e:
    print(f"Error in get_sequence: {e}")

def displaySequence(serverSequence):
  for i in serverSequence:
    if i == 0:
      red()
      time.sleep(1)
      black()
      time.sleep(0.05)
    elif i == 1:
      green()
      time.sleep(1)
      black()
      time.sleep(0.05)
    elif i == 2:
      yellow()
      time.sleep(1)
      black()
      time.sleep(0.05)
  black()
  time.sleep(2)

@sio.event
def connect():
    print('connection established')
    print('0 = red, 1 = green, 2 = yellow')

@sio.event
def pi_sequence(sequence):
    print('current sequence ', sequence)
    # Your LED control logic here
    displaySequence(sequence)
    #sio.emit('pi_sequence', 'sequence received')

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://172.20.10.6:3000') #replace with your server IP
sio.wait()


    				
    	


# if __name__ == "__main__":
#   main()