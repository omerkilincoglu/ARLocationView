// App.tsx
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "./constants/colors";

import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

// Expo’nun default splash’ını OTOMATİK kapatma → iptal ettik
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync(MaterialCommunityIcons.font);
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        // ✅ hazır olduğunda splash tamamen kapanır → senin SplashScreen.tsx açılır
        SplashScreen.hideAsync();
      }
    }
    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; // fontlar yüklenene kadar splash devam eder
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        {/* ✅ StatusBar sabit */}
        <StatusBar
          translucent
          backgroundColor={Colors.primaryDark}
          barStyle="light-content"
        />
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
