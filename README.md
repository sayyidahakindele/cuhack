# Dove Online and HardWare Game
## Dove Color Sequence - Project Title

## Group:
    Victor Kolawole
    Doyinsola Akindele
    Oluwaseun Ogunmeru
    Ediabasieyenemi Ekeng

## Project description:
Using the QNX real time operating system on a Rasberry Pi, start we developed a game which serves as good exercise for memory. The Rasberry Pi displays a sequence of colors progresivly increasing in sequence size, the user is tasked with inputing the colors in correct order after it is diplayed. Every successful entry of the sequence adds one point to the score of the games session as well as increasing the number of colors diplayed in the next round by one. If the user is registered and logged in their highest score will be saved in the database. The keyboard of a laptop is used as the input method and the score will be diplayed on the screen. 


# PROJECT STACK
## Front End App
### Features/Components:
- React Native

Start client
  1. cd dove-frontend
  2. npm install
  3. npx expo start

server live at - https://dove-juk2.onrender.com

## Backend
### Features/Components:
- Flask
- Sockets
  
How to run:
Start server
  1. flask --app server run --host=0.0.0.0 --port=3000
## Hardware
### Features/Components:
- RTOS: QNX
- Rapberry Pi 4
- LED

-install QNX 8.0 on a raspberry pi 4

- ssh into raspberry pi
	- (local testing) make sure pi and your computer are on the same network. you can edit the pis wpa_supplicant.conf file to add a new network
	- ssh -m hmac-sha2-256 qnxuser@your-ipv4-IPadress
	- password: qnxuser

- switch to root
	- su -
	- password: root

- run the virtual environment
	- source ./venv/bin/activate

- navigate to the /tmp folder

- run the python script to connect the LEDs to the server
	- python main.py 

how to stop the python script
- web sockets block the main thread so we cant close it with ctrl + c
- run ctrl + z to send it to bg
- run kill %1 to kill the process
- run jobs to make sure it terminated
- if all else fails, restart the server (it forces the socket to fail)
