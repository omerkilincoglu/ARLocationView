// components/MarkerOverlay.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import type { Place } from "../types";
import { formatDistance } from "../lib/geo";
import ImageWithFallback from "./ImageWithFallback";
import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");

type MarkerOverlayProps = {
  place: Place;
  dist: number;
  onPress: () => void;
};

export default function MarkerOverlay({
  place,
  dist,
  onPress,
}: MarkerOverlayProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.marker, { opacity: pressed ? 0.85 : 1 }]}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      android_ripple={{ color: "rgba(255,255,255,0.15)" }}
    >
      {/* Resim */}
      <ImageWithFallback uri={place.images?.[0]} style={styles.markerPhoto} />

      {/* Başlık + Mesafe */}
      <View style={styles.textContainer}>
        <Text style={styles.markerTitle} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.markerSub}>{formatDistance(dist)}</Text>
      </View>

      {/* Kuyruk oku */}
      <View style={styles.markerTail} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: width * 0.45,
    maxWidth: 200,
    minWidth: 150,
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(11,124,153,0.3)",
    alignItems: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  markerPhoto: {
    width: "100%",
    height: 85,
    borderRadius: 12,
    marginBottom: 8,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  markerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  markerSub: {
    color: Colors.accent,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  markerTail: {
    position: "absolute",
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.accent,
  },
});
