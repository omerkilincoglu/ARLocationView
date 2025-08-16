// components/MarkerOverlay.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import type { Place } from "../types";
import { formatDistance } from "../lib/geo";

import { Colors } from "../constants/colors";

const { width, height } = Dimensions.get("window");

type MarkerOverlayProps = {
  place: Place;
  dist: number;
  onPress: () => void;
  imageMap: Record<string, any>;
};

export default function MarkerOverlay({
  place,
  dist,
  onPress,
  imageMap,
}: MarkerOverlayProps) {
  return (
    <Pressable style={styles.marker} onPress={onPress}>
      {place.image && imageMap[place.image] && (
        <Image source={imageMap[place.image]} style={styles.markerPhoto} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.markerTitle} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.markerSub}>{formatDistance(dist)}</Text>
      </View>
      <View style={styles.markerTail} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
    width: width * 1, // ekranın %45’i kadar genişlik
    maxWidth: 200, // çok büyümesin
    minWidth: 150, // çok küçülmesin
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(11, 124, 153, 0.3)", // Daha yumuşak çerçeve
    alignItems: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4, // Daha hafif gölge
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
    color: "#FFFFFF", // Tam beyaz
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  markerSub: {
    color: Colors.accent,
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
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
    borderTopColor: "rgba(11, 124, 153, 0.85)", // Marker ile aynı renk
  },
});
