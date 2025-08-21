// screens/OnboardingScreen.tsx
import React from "react";
import { Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅
import { Colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={[styles.container]} edges={["top", "bottom"]}>
      {/* Arka plan görsel */}
      <Image
        source={require("../assets/onboarding.png")}
        style={styles.image}
        resizeMode="cover"
      />
      {/* İçerik kutusu */}
      <TouchableOpacity activeOpacity={1} style={styles.card}>
        <Text style={styles.title}>Discover Nearby Places</Text>
        <Text style={styles.description}>
          Open your camera and discover the world around you through AR. Find
          restaurants, parks, and more as they appear live on your screen
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home", { ar: false })}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "40%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    paddingTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 20,
    top: 80,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
