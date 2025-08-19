// components/InfoBar.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import { Colors } from "../constants/colors";

type InfoBarProps = {
  mode: "top" | "bottom" | "filter";
  currentAddress?: string | null;
  navigation?: any;
  onPress?: () => void;
};

export default function InfoBar({
  mode,
  currentAddress,
  navigation,
  onPress,
}: InfoBarProps) {
  const route = useRoute();
  const params: any = route.params ?? {}; // ar parametresini güvenli alabilmek için

  if (mode === "top") {
    return (
      <View style={styles.topBar}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={22}
          color="#ef4444" // 🔴 kırmızı ikon
        />
        <Text style={styles.infoText}>{currentAddress || "Locating..."}</Text>
      </View>
    );
  }

  if (mode === "bottom") {
    return (
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.bottomItem}
          onPress={() => navigation.navigate("Home", { ar: false })}
        >
          <View
            style={[
              styles.iconWrapper,
              route.name === "Home" && !params.ar
                ? { backgroundColor: Colors.primaryDark }
                : {},
            ]}
          >
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={
                route.name === "Home" && !params.ar
                  ? Colors.white
                  : Colors.primaryDark
              }
            />
          </View>

          <Text style={styles.bottomLabel}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.bottomItem}
          onPress={() => navigation.push("Home", { ar: true })}
        >
          <View
            style={[
              styles.iconWrapper,
              route.name === "Home" && params.ar
                ? { backgroundColor: Colors.primaryDark }
                : {},
            ]}
          >
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color={
                route.name === "Home" && params.ar
                  ? Colors.white
                  : Colors.primaryDark
              }
            />
          </View>

          <Text style={styles.bottomLabel}>AR</Text>
        </Pressable>

        <Pressable
          style={styles.bottomItem}
          onPress={() => navigation.navigate("AllPlaces")}
        >
          <View
            style={[
              styles.iconWrapper,
              route.name === "AllPlaces"
                ? { backgroundColor: Colors.primaryDark }
                : {},
            ]}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color={
                route.name === "AllPlaces" ? Colors.white : Colors.primaryDark
              }
            />
          </View>

          <Text style={styles.bottomLabel}>All Places</Text>
        </Pressable>
      </View>
    );
  }

  if (mode === "filter") {
    return (
      <View style={styles.filterBar}>
        <Pressable style={styles.filterBtn} onPress={onPress}>
          <MaterialCommunityIcons
            name="tune-variant"
            size={22}
            color={Colors.primaryDark}
          />
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 12,
    elevation: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    flex: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.primaryDark,
  },
  bottomItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(11,124,153,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLabel: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: "600",
    marginTop: 4,
  },
  filterBar: {
    position: "absolute",
    top: 60,
    right: 10,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
  },
});
