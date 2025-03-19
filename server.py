from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

color_sequence = []
user_sequence = []
pi_status = 'true'
hscore = 0

def get_random_color():
    return random.randint(0, 2)

def send_sequence_to_pi(sequence):
    socketio.emit('pi_sequence', sequence)

@app.route('/color_sequence', methods=['GET'])
def color_sequence_route():
    global color_sequence
    color_sequence.append(get_random_color())
    print(color_sequence)
    send_sequence_to_pi(color_sequence) #send the sequence to the pi
    return jsonify({"status": pi_status, "sequence": color_sequence})

@app.route('/score', methods=['GET'])
def score():
    return jsonify({"score": len(color_sequence)})

@app.route('/highscore', methods=['GET'])
def highscore():
    global hscore  
    if len(color_sequence) > hscore:
        hscore = len(color_sequence)
        
    return jsonify({"highscore": hscore})

@app.route('/check_sequence', methods=['POST'])
def check_sequence():
    global color_sequence, user_sequence, pi_status
    data = request.get_json()
    number = data.get("number")
    user_sequence.append(number)
    
    is_correct = all(user_sequence[i] == color_sequence[i] for i in range(len(user_sequence)))
    
    if not is_correct:
        color_sequence = []
        user_sequence = []
        color_sequence.append(get_random_color())
        print(color_sequence)
        pi_status = 'true'
        return jsonify({"status": "fail", "message": "Wrong sequence! Restarting..."})
    
    if len(user_sequence) == len(color_sequence):
        user_sequence = []
        pi_status = 'true'
        return jsonify({"status": "correct", "message": "Correct! Next round starting..."})
    
    pi_status = 'false'
    return jsonify({"status": "waiting", "message": "Keep going..."})

@app.route('/reset', methods=['GET'])
def reset():
    global color_sequence, user_sequence
    color_sequence = []
    user_sequence = []
    return jsonify({"message": "Game reset!"})

@socketio.on('connect')
def handle_connect():
    print('Client connected')

# if __name__ == '__main__':
#     app.run(port=3000, debug=True)
if __name__ == '__main__':
    socketio.run(app) #must use socketio.run() instead of app.run() to use socketio
