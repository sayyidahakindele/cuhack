import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const COLORS = ["red", "green", "yellow", "blue"];
const SERVER_URL = "http://172.20.10.6:3000/";

const App = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [hscore, setHScore] = useState<number>(0);
  const [status, setStatus] = useState("");
  const [activeButton, setActiveButton] = useState<number | null>(null);

  // Fetch new sequence from server
  const fetchSequence = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/color_sequence`);
      console.log(response.data.sequence);
      setSequence(response.data.sequence);
      setUserInput([]);
      setStatus("Watch the sequence");
      playSequence(response.data.sequence);
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error fetching sequence");
    }
  };

  const playSequence = (seq: number[]) => {
    seq.forEach((colorIndex, i) => {
      setTimeout(() => {
        setActiveButton(colorIndex); // Highlight button
        setTimeout(() => setActiveButton(null), 500); // Remove highlight after 500ms
      }, i * 1000);
    });

    setTimeout(() => setStatus("Your turn!"), seq.length * 1000);
  };

  // Fetch current score from server
  const fetchScore = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/score`);
      setScore(response.data.score);
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };

  // Fetch high score from server
  const fetchHScore = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/highscore`);
      setHScore(response.data.highscore);
    } catch (error) {
      console.error("Error fetching highscore:", error);
    }
  };

  // Handle user input
  const handleUserInput = async (colorIndex: number) => {
    setActiveButton(colorIndex);
    setTimeout(() => setActiveButton(null), 300);
    setUserInput([...userInput, colorIndex]);

    try {
      const response = await axios.post(`${SERVER_URL}/check_sequence`, {
        number: colorIndex,
      });

      setStatus(response.data.message);

      if (response.data.status === "fail") {
        Alert.alert("Game Over", `Wrong sequence! Your score: ${score}`);
        setScore(0);
      } else if (response.data.status === "correct") {
        fetchScore();
        fetchHScore();
        setTimeout(fetchSequence, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error checking sequence");
    }
  };

  // Reset the game
  const resetGame = async () => {
    try {
      await axios.get(`${SERVER_URL}/reset`);
      setSequence([]);
      setUserInput([]);
      setScore(0);
      setStatus("Game Reset");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.buttonText}>High score: {hscore}</Text>
        <Text style={styles.buttonText}>Score: {score}</Text>
        <View style={styles.container}>
          <View style={styles.circle}>
            {COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quarter,
                  { backgroundColor: color },
                  index === 0 && styles.topLeft,
                  index === 1 && styles.topRight,
                  index === 2 && styles.bottomLeft,
                  index === 3 && styles.bottomRight,
                  activeButton === index && { opacity: 0.5 },
                ]}
                onPress={() => handleUserInput(index)}
              />
            ))}
            <View style={styles.startButton}>
              <TouchableOpacity onPress={fetchSequence}>
                <Text style={styles.buttonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const SIZE = 300;
const INNER_SIZE = SIZE / 2.5;
const QUARTER_SIZE = SIZE / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282828",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  startButton: {
    position: "absolute",
    width: INNER_SIZE,
    height: INNER_SIZE,
    backgroundColor: "black",
    borderRadius: INNER_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    top: (SIZE - INNER_SIZE) / 2,
    left: (SIZE - INNER_SIZE) / 2,
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  quarter: {
    width: QUARTER_SIZE,
    height: QUARTER_SIZE,
  },
  topLeft: {
    borderTopLeftRadius: SIZE / 2,
  },
  topRight: {
    borderTopRightRadius: SIZE / 2,
  },
  bottomLeft: {
    borderBottomLeftRadius: SIZE / 2,
  },
  bottomRight: {
    borderBottomRightRadius: SIZE / 2,
  },
});

export default App;
