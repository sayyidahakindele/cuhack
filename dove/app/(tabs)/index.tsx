import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const COLORS = ['red', 'green', 'yellow'];
const SERVER_URL = 'http://172.17.118.51:3000';

const App = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [status, setStatus] = useState('');

  // Fetch new sequence from server
  const fetchSequence = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/color_sequence`);
      setSequence(response.data.sequence);
      setUserInput([]);
      setStatus('Watch the sequence');
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error fetching sequence');
    }
  };

  // Fetch current score from server
  const fetchScore = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/current_score`);
      setScore(response.data.score);
    } catch (error) {
      console.error('Error fetching score:', error);
    }
  };

  // Handle user input
  const handleUserInput = async (colorIndex: number) => {
    setUserInput([...userInput, colorIndex]);

    try {
      const response = await axios.post(`${SERVER_URL}/check_sequence`, { number: colorIndex });

      setStatus(response.data.message);

      if (response.data.status === 'fail') {
        setScore(response.data.score); // Update score
        Alert.alert('Game Over', `Wrong sequence! Your score: ${response.data.score}`);
      } else if (response.data.status === 'correct') {
        fetchScore(); // Update score
        setTimeout(fetchSequence, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error checking sequence');
    }
  };

  // Reset the game
  const resetGame = async () => {
    try {
      await axios.get(`${SERVER_URL}/reset`);
      setSequence([]);
      setUserInput([]);
      setScore(0);
      setStatus('Game Reset');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.buttonText}>High score: </Text>
        <Text style={styles.buttonText}>Score: {score}</Text>
        <Text style={styles.sequence}>{sequence.map(i => COLORS[i]).join(', ')}</Text>

        {/* Color Buttons */}
        <View style={styles.buttonContainer}>
          {COLORS.map((color, index) => (
            <TouchableOpacity key={index} style={[styles.button, { backgroundColor: color.toLowerCase() }]} onPress={() => handleUserInput(index)}>
              <Text style={styles.buttonText}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Controls */}
        <TouchableOpacity style={styles.controlButton} onPress={fetchSequence}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={resetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sequence: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  button: { width: 80, height: 80, margin: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  controlButton: { backgroundColor: 'black', padding: 10, borderRadius: 5, margin: 10 },
});

export default App;