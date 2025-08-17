import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import PlaceDetail from "../screens/PlaceDetail";
import AllPlacesScreen from "../screens/AllPlacesScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import type { RootStackParamList } from "../types";
import InfoBar from "../components/InfoBar";
import { Colors } from "../constants/colors";

export type { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="AllPlaces">
        {(props) => (
          <View style={{ flex: 1 }}>
            <AllPlacesScreen {...(props as any)} />
            <InfoBar mode="bottom" navigation={props.navigation} />
          </View>
        )}
      </Stack.Screen>

      <Stack.Screen name="PlaceDetail">
        {(props) => (
          <View style={{ flex: 1 }}>
            <PlaceDetail {...(props as any)} />
            <InfoBar mode="bottom" navigation={props.navigation} />
          </View>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
