import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '../../src/screens/HomeScreen';

export default function App() {
  console.log("PAPAPPAPAUI")
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E2E' }}>
        <HomeScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}