// screens/OnboardingScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Animated,
  StyleSheet as RNStyleSheet,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // 🔹 Başlık & açıklama animasyonları
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;

  const descFade = useRef(new Animated.Value(0)).current;
  const descSlide = useRef(new Animated.Value(30)).current;

  // 🔹 Shimmer animasyonu
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Başlık animasyonu
    Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 700,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 700,
        delay: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Açıklama animasyonu (1 saniye gecikmeli)
    Animated.parallel([
      Animated.timing(descFade, {
        toValue: 1,
        duration: 700,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(descSlide, {
        toValue: 0,
        duration: 700,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer animasyonu (sonsuz loop)
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Shimmer kayma efekti
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Arka plan görsel */}
      <Image
        source={require("../assets/onboarding.png")}
        style={styles.image}
        resizeMode="cover"
      />

      {/* İçerik kutusu */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 20 }]}>
        {/* 🔹 Animasyonlu başlık */}
        <Animated.Text
          style={[
            styles.title,
            { opacity: titleFade, transform: [{ translateY: titleSlide }] },
          ]}
        >
          Discover Nearby Places
        </Animated.Text>

        {/* 🔹 Animasyonlu açıklama */}
        <Animated.Text
          style={[
            styles.description,
            { opacity: descFade, transform: [{ translateY: descSlide }] },
          ]}
        >
          Open your camera and discover the world around you through AR. Find
          restaurants, parks, and more as they appear live on your screen
        </Animated.Text>

        {/* 🔹 Shimmer efektli buton */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home", { ar: false })}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>

          {/* Shimmer overlay */}
          <Animated.View
            style={[
              RNStyleSheet.absoluteFill,
              { transform: [{ translateX: shimmerTranslate }] },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
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
    position: "absolute", // arka planda sabit
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "44%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textDark,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 16,
    borderRadius: 30,
    width: "85%",
    marginTop: 20,
    overflow: "hidden", // shimmer efektini düzgün kesmek için
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    zIndex: 2,
  },
});
