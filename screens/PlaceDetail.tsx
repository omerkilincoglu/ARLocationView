// screens/PlaceDetail.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { Place } from "../types";
import { formatDistance } from "../lib/geo";
import imageMap from "../constants/imageMap";
import { Colors } from "../constants/colors";

type Params = {
  PlaceDetail: { place: Place; dist: number };
};

// kategori ikonları eşleşmesi
const categoryIcons: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  mosque: "mosque",
  cafe: "coffee",
  library: "book",
  bus_stop: "bus",
  faculty: "school",
  administration: "office-building",
  post_office: "email",
  square: "city",
  institute: "domain",
};

export default function PlaceDetail() {
  const route = useRoute<RouteProp<Params, "PlaceDetail">>();
  const { place, dist } = route.params;

  const handleGetDirections = () => {
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(navUrl);
  };

  const handleOpenMaps = () => {
    Linking.openURL(place.maps_link);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Fotoğraf */}
        <Image
          source={imageMap[place.image]}
          style={styles.photo}
          resizeMode="cover"
        />

        {/* Bilgi Kartı */}
        <View style={styles.card}>
          <Text style={styles.title}>{place.name}</Text>

          {/* Mesafe */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={22}
              color={Colors.primaryDark}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{formatDistance(dist)}</Text>
          </View>

          {/* Kategori */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={categoryIcons[place.category] || "tag"}
              size={22}
              color={Colors.primaryDark}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{place.category}</Text>
          </View>

          {/* Adres */}
          {place.address && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={22}
                color={Colors.primaryDark}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{place.address}</Text>
            </View>
          )}

          {/* Koordinatlar */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map"
              size={22}
              color={Colors.primaryDark}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {place.latitude}, {place.longitude}
            </Text>
          </View>

          {/* Ayrıntı linki */}
          <Pressable onPress={handleOpenMaps}>
            <Text style={styles.linkText}>
              For detailed location click here ↓
            </Text>
          </Pressable>

          {/* Yön tarifi butonu */}
          <Pressable style={styles.button} onPress={handleGetDirections}>
            <Text style={styles.buttonText}>Get Directions</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 30,
    backgroundColor: Colors.background,
  },
  photo: {
    width: "100%",
    height: 280,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primaryDark,
    textAlign: "center",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textLight,
    flexShrink: 1,
  },
  linkText: {
    fontSize: 14,
    color: "orangered",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 14,
    backgroundColor: Colors.primaryDark, // koyu mavi
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
