// screens/OnboardingScreen.tsx
import React, { useEffect } from "react";
import { StyleSheet, ImageBackground, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { useNavigation } from "@react-navigation/native";

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavProp>();

  useEffect(() => {
    StatusBar.setHidden(true, "fade");

    const timer = setTimeout(() => {
      StatusBar.setHidden(false, "fade");
      navigation.replace("Onboarding"); // İlk girişte Onboarding ekranına git
    }, 3000);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false, "fade");
    };
  }, [navigation]);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/splash-icon.png")}
      resizeMode="cover"
    />
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
