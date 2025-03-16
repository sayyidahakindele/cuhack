const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let colorSequence = [];
let pi_status = 'true'
let userSequence = [];

// Generates a random color (0=Red, 1=Green, 2=Yellow)
function getRandomColor() {
    return Math.floor(Math.random() * 3);
}

// Start or continue game
app.get('/color_sequence', (req, res) => {
    colorSequence.push(getRandomColor());
    res.json({ status: pi_status, sequence: colorSequence });
    console.log(pi_status)
});

// Receive user input and validate
app.post('/check_sequence', (req, res) => {
    const { number } = req.body;
    userSequence.push(number);

    // Check if user input matches the correct sequence
    const isCorrect = userSequence.every((num, index) => num === colorSequence[index]);

    if (!isCorrect) {
        res.json({ status: 'fail', message: 'Wrong sequence! Restarting...' });
        colorSequence = [];
        userSequence = [];
        colorSequence.push(getRandomColor());
        console.log(colorSequence);
        pi_status = 'true';
    } else if (userSequence.length === colorSequence.length) {
        userSequence = []; // Reset user input for next round
        res.json({ status: 'correct', message: 'Correct! Next round starting...' });
        pi_status = 'true';
    } else {
        res.json({ status: 'waiting', message: 'Keep going...' });
        pi_status = 'false';
    }
});

// Reset game
app.get('/reset', (req, res) => {
    colorSequence = [];
    userSequence = [];
    res.json({ message: 'Game reset!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});