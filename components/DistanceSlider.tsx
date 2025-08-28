// components/DistanceSlider.tsx
import React, { useRef } from "react";
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track genişliği slider konumuna göre değişir
  const trackWidth = 44 + sliderRaw * 10; // min 44px, max ~54px

  const handleSliderChange = (val: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSliderRaw(val);
    }, 50); // ✅ 50ms debounce → akıcı güncelleme
  };

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
          onValueChange={handleSliderChange} // ✅ debounce edilmiş handler
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor="rgba(255, 255, 255, 0.8)"
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
    top: "45%",
    bottom: "12%",
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  sliderTrack: {
    backgroundColor: "rgba(17, 50, 149, 0.5)", // Colors.primaryDark ama %80 opak
    height: "60%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
  },
  slider: {
    width: "400%",
    height: 800,
    transform: [{ rotate: "-90deg" }],
  },
  sliderLabel: {
    position: "absolute",
    top: "9%",
    alignSelf: "center",
  },
  distanceText: {
    color: Colors.accent,
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "rgba(17, 50, 149, 0.7)", // Colors.primaryDark ama %80 opak
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",

    width: 70, // ✅ sabit genişlik
    height: 32, // ✅ sabit yükseklik
    textAlign: "center", // ✅ yatay ortalama
    textAlignVertical: "center", // ✅ dikey ortalama (Android)
    lineHeight: 28, // ✅ yazıyı dikey ortada tut
  },
});
