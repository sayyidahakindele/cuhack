import rpi_gpio as GPIO  # Import the QNX Raspberry Pi GPIO module for controlling GPIO pins
import time  # Import the time module for adding delays
from getSequenceCode import get_sequence

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


##0 = 
def main():
    while(True):
        seq = get_sequence()
        print(seq)  # Print the response content
        status = seq.get('status')
        listx = seq.get('sequence')
        print(status)
        print(listx)
        
        if(status == 'false'):
            sleep(3)
            continue
        else:
            for x in listx:
                if x == 0:
                    red()
                    time.sleep(1)
                    black()
                    time.sleep(0.05)
                elif x == 1:
                    green()
                    time.sleep(1)
                    black()
                    time.sleep(0.05)
                elif x == 2:
                    yellow()
                    time.sleep(1)
                    black()
                    time.sleep(0.05)
            black()
            time.sleep(2)
    				
    	


if __name__ == "__main__":
  main()