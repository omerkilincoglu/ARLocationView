// screens/OnboardingScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity ,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
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
    <View style={styles.container}>
      {/* Arka plan görsel */}
      <Image
        source={require("../assets/onboarding.png")} // 1080x2400 PNG
        style={styles.image}
        resizeMode="cover"
      />

      {/* İçerik kutusu */}
      <View style={styles.card}>
        <Text style={styles.title}>Discover Nearby Places</Text>
        <Text style={styles.description}>
          Open your camera and discover the world around you through AR. Find
          restaurants, parks, and more as they appear live on your screen
        </Text>
        <TouchableOpacity  
          style={styles.button}
          onPress={() => navigation.navigate("Home", { ar: false })}
          activeOpacity={0.7}   // basınca opaklık hissi
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  card: {
    position: "absolute",
    bottom: 0, // Kart tam alta yapışsın
    width: "100%", // Tam genişlik
    height: "40%", // Ekranın yaklaşık 2/5’i kadar yükseklik
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30, // Sadece üst köşeler yuvarlak
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 }, // gölge üstten gelsin
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
    borderRadius: 25, // Daha yuvarlak olsun
    marginHorizontal: 20,
    top: 80, // Kartın üstüne biraz daha yakın
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
