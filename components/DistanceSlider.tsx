// components/DistanceSlider.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { formatDistance } from "../lib/geo";
import { Colors } from "../constants/colors";

type DistanceSliderProps = {
  sliderRaw: number;
  setSliderRaw: (value: number) => void;
  maxDistance: number;
};

export default function DistanceSlider({
  sliderRaw,
  setSliderRaw,
  maxDistance,
}: DistanceSliderProps) {
  // Track genişliği slider konumuna göre değişir
  const trackWidth = 44 + sliderRaw * 10; // min 44px, max ~54px

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderLabel}>
        <Text style={styles.distanceText}>{formatDistance(maxDistance)}</Text>
      </View>
      <View style={[styles.sliderTrack, { width: trackWidth }]}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={sliderRaw}
          onValueChange={setSliderRaw}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
          thumbTintColor={Colors.accent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    position: "absolute",
    right: 5,
    top: "10%",
    bottom: "10%",
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  sliderTrack: {
    backgroundColor: Colors.primaryDark,
    height: "35%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
  },
  slider: {
    width: "500%",
    height: 80,
    transform: [{ rotate: "-90deg" }],
  },
  sliderLabel: {
    position: "absolute",
    top: 180,
    alignSelf: "center",
  },
  distanceText: {
    color: Colors.accent,
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
  },
});
