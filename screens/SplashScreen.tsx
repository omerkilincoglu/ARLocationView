// screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { StyleSheet, ImageBackground, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { useNavigation } from "@react-navigation/native";

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Onboarding"); // İlk girişte Onboarding ekranına git
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/splash.png")}
      resizeMode="cover"
    >
      {/* ✅ Splash sırasında status bar tamamen gizli */}
      <StatusBar hidden />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
