import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const SERVER_URL = 'http://172.17.118.51:3000';

const App = () => {

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.centeredContainer}>
        <Text>dove</Text>
        <Text>hi</Text>

        
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  status: { fontSize: 18, marginBottom: 10 },
  sequence: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  button: { width: 80, height: 80, margin: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  controlButton: { backgroundColor: 'black', padding: 10, borderRadius: 5, margin: 10 },
});

export default App;