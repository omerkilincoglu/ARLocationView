// screens/PlaceDetail.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RouteProp, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { Place } from "../types";
import { formatDistance } from "../lib/geo";
import { Colors } from "../constants/colors";
import ImageWithFallback from "../components/ImageWithFallback";

type Params = {
  PlaceDetail: { place: Place; dist: number };
};

// kategori ikonları eşleşmesi
export const categoryIcons: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  all: "apps",

  // 🍴 Yeme & İçme
  cafe: "coffee",
  restaurant: "silverware-fork-knife",

  // 🏠 Konaklama
  dormitory: "home-group",

  // 🕌 Kültürel & Dini
  mosque: "mosque",
  library: "book",

  // 🚏 Ulaşım
  bus_stop: "bus",
  terminal: "bus-multiple",

  // 🏫 Eğitim & Yönetim
  school: "school-outline", // 🆕 Okul
  university: "school", // Üniversite
  faculty: "domain", // Fakülte
  administration: "office-building",
  institute: "domain",

  // 🏥 Sağlık & Güvenlik
  hospital: "hospital-building",
  health_center: "medical-bag",
  pharmacy: "pill",
  police: "police-badge",

  // 🏙️ Şehir Alanları
  square: "city",
  post_office: "email",
};

export default function PlaceDetail() {
  const route = useRoute<RouteProp<Params, "PlaceDetail">>();
  const { place, dist } = route.params ?? {};

  // 📌 Eğer parametre yoksa profesyonel uyarı göster
  if (!place) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.warningBox}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={50}
            color={Colors.error}
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.warningTitle}>No Place Data</Text>
          <Text style={styles.warningText}>
            Sorry, we could not load the details for this place.
          </Text>
        </View>
      </View>
    );
  }

  const handleGetDirections = () => {
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(navUrl);
  };

  const handleOpenMaps = () => {
    Linking.openURL(place.maps_link);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Fotoğraf */}
        <ImageWithFallback uri={place.image} style={styles.photo} />

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

          {/* Ayrıntı bilgisi (buton değil, sadece text + ikon) */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <Text style={styles.linkText}>
              For detailed location click here
            </Text>
            <MaterialCommunityIcons
              name="arrow-down-bold-circle"
              size={22}
              color={Colors.accent}
              style={{ marginLeft: 6 }}
            />
          </View>

          {/* Yön tarifi butonu */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetDirections}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
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
    fontSize: 15,
    color: "orangered",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 14,
    backgroundColor: Colors.primaryDark,
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
  warningBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.error,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
  },
});
