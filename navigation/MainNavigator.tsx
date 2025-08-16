import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import PlaceDetail from "../screens/PlaceDetail";
import AllPlacesScreen from "../screens/AllPlacesScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import type { RootStackParamList } from "../types";
import { Colors } from "../constants/colors";

export type { RootStackParamList } from "../types";

// Tek Stack tanımı
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
      <Stack.Screen name="AllPlaces" component={AllPlacesScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
