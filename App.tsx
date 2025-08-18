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

SplashScreen.preventAutoHideAsync(); // ✅ splash hemen kaybolmasın

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
      }
    }
    loadResources();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // ✅ fontlar yüklenince splash kapanır
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // ✅ splash gösterilmeye devam etsin
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar
          translucent
          backgroundColor={Colors.primaryDark}
          barStyle="light-content" // ✅ koyu mavi üstünde beyaz ikon
        />
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
