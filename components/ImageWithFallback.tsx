// components/ImageWithFallback.tsx
import React, { useState } from "react";
import { View, Image, StyleProp, ImageStyle, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type Props = {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  pointerEvents?: "none" | "auto" | "box-none" | "box-only";
  resizeMode?: "cover" | "contain" | "stretch" | "center";
};

export default function ImageWithFallback({
  uri,
  style,
  pointerEvents,
  resizeMode = "cover", // ✅ default cover yaptık
}: Props) {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <View
        style={[
          style,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f1f5f9",
          },
        ]}
        pointerEvents="none"
      >
        <MaterialCommunityIcons
          name="image-off"
          size={32}
          color={Colors.textLight}
        />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
}
