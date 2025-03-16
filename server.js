const express = require('express');
const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const path = require('path');

// Define the database file
const dbPath = path.join(__dirname, 'game_schema.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

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

//adds the new users information to the database
app.post('/newUser', (req, res) => {
    const { n } = req.body;

    if (!n) {
        return res.status(400).json({ error: 'Username is required' });
    }

    db.run('INSERT INTO users (username) VALUES (?)', [n], function (err) {
        if (err) {
            console.error('Error inserting into database:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'User added successfully', user_id: this.lastID });
    });
});

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

    var highscore;
    const query = 'SELECT user_high_score FROM users';

    db.get(query, highscore, (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!row) {
            return res.status(404).send("score not found");
        }
    });


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

        if(userSequence.length > highscore) {
            db.run('UPDATE users SET user_high_score = ?', userSequence.length, function (err) {
                if (err) {
                    console.error('Error inserting into database:', err.message);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ message: 'User added successfully', user_id: this.lastID });
            });
        }
        
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