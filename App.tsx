//App.tsx
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";
import { StatusBar, AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "./constants/colors";

import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        StatusBar.setBackgroundColor(Colors.primaryDark);
        StatusBar.setBarStyle("light-content");
      }
    });
    return () => sub.remove();
  }, []);

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

  if (!fontsLoaded) {
    return null; // fontlar yüklenene kadar boş (ama Expo splash yok çünkü kaldırdık)
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar
          translucent={false}
          backgroundColor={Colors.primaryDark}
          barStyle="light-content"
        />
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
