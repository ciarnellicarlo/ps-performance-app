import React from 'react';
import { Text, TextInput } from 'react-native';
import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import HomeScreen from '../../src/screens/HomeScreen';
import * as SplashScreen from 'expo-splash-screen';

const DefaultFontText = Text as any;
DefaultFontText.defaultProps = {
  ...DefaultFontText.defaultProps,
  style: { fontFamily: 'Poppins_400Regular' }
};

const DefaultFontTextInput = TextInput as any;
DefaultFontTextInput.defaultProps = {
  ...DefaultFontTextInput.defaultProps,
  style: { fontFamily: 'Poppins_400Regular' }
};

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_700Bold,
    });

    React.useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
      return null;
    }
    return (
            <SafeAreaProvider>
              <StatusBar barStyle="light-content" />
              <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E2E' }}>
                <HomeScreen />
              </SafeAreaView>
            </SafeAreaProvider>
    );
}