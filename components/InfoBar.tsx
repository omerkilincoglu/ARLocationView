// components/InfoBar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Colors } from "../constants/colors";

type InfoBarProps = {
  mode: "top" | "bottom" | "filter";
  currentAddress?: string | null;
  navigation?: any;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; // ✅
};

export default function InfoBar({
  mode,
  currentAddress,
  navigation,
  onPress,
  style,
}: InfoBarProps) {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const params: any = route.params ?? {}; // ar parametresini güvenli alabilmek için

  if (mode === "top") {
    return (
      <View style={[styles.topBar, { top: insets.top + 10 }, style]}>
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
      <View style={[styles.bottomBar, style]}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate("Home", { ar: false })}
          activeOpacity={0.6}
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
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.push("Home", { ar: true })}
          activeOpacity={0.6} // basınca opaklık hissi
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
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate("AllPlaces")}
          activeOpacity={0.6} // basınca opaklık hissi
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
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === "filter") {
    return (
      <View style={[styles.filterBar, style]}>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={onPress}
          activeOpacity={0.6}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={26}
            color={Colors.white}
          />
        </TouchableOpacity>
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
    right: 15,
    top: "8%", // pause’un üstünde
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
