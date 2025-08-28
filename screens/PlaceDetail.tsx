// screens/PlaceDetail.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import ImageViewing from "react-native-image-viewing";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { formatPhone } from "../lib/phoneFormat";
import type { Place } from "../types";
import { formatDistance } from "../lib/geo";
import { Colors } from "../constants/colors";
import ImageWithFallback from "../components/ImageWithFallback";
import { categoryColors } from "../components/CategoryFilter";

const { width: SCREEN_W } = Dimensions.get("window");

type Params = {
  PlaceDetail: { place: Place; dist: number };
};

// kategori ikonları eşleşmesi
export const categoryIcons: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  all: "apps",
  cafe: "coffee",
  restaurant: "silverware-fork-knife",
  dormitory: "home-group",
  mosque: "mosque",
  library: "book",
  bus_stop: "bus",
  terminal: "bus-multiple",
  school: "school-outline",
  university: "school",
  faculty: "domain",
  administration: "office-building",
  institute: "domain",
  hospital: "hospital-building",
  health_center: "medical-bag",
  pharmacy: "pill",
  police: "police-badge",
  square: "city",
  post_office: "email",
  park: "pine-tree",
};

export default function PlaceDetail() {
  const flatListRef = useRef<FlatList<string>>(null);
  const route = useRoute<RouteProp<Params, "PlaceDetail">>();
  const { place, dist } = route.params ?? {};

  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGetDirections = () => {
    if (!place) return;
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(navUrl);
  };

  const handleOpenMaps = () => {
    if (place?.maps_link) Linking.openURL(place.maps_link);
  };

  // 📌 InfoRow için props tipi
  type InfoRowProps = {
    icon: string;
    label: string;
    onPress?: () => void;
  };

  // 📌 İletişim ikonlarının renkleri
  const infoColors: Record<string, string> = {
    phone: "#16A34A", // yeşil
    email: "#f36a48ff", // gmail kırmızı
    web: "#1A73E8", // mavi (google blue)
    instagram: "#E1306C", // pembe
    "map-marker-path": Colors.primaryDark, // kırmızı
    default: Colors.primaryDark,
  };

  // 📌 InfoRow bileşeni
  function InfoRow({ icon, label, onPress }: InfoRowProps) {
    let color: string;

    // kategori mi yoksa iletişim mi?
    if (Object.keys(categoryColors).includes(icon)) {
      // kategori → categoryColors'tan al
      color = categoryColors[icon];
    } else {
      // iletişim → infoColors'tan al
      color = infoColors[icon] || infoColors.default;
    }

    return (
      <TouchableOpacity
        style={styles.infoRow}
        disabled={!onPress}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={22}
          color={color}
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {!place ? (
        // 📌 Eğer parametre yoksa
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
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Fotoğraf Galerisi */}
          <View style={{ position: "relative" }}>
            <FlatList
              ref={flatListRef}
              data={place.images || []}
              horizontal
              pagingEnabled
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: SCREEN_W,
                    height: 280,
                    backgroundColor: "black",
                    position: "relative", // buton için gerekli
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    style={{ width: SCREEN_W, height: 280 }}
                    resizeMode="cover"
                  />

                  {/* 🔍 Fullscreen butonu */}
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderRadius: 20,
                      padding: 6,
                    }}
                    onPress={() => setModalVisible(true)} // veya setViewerVisible(true) → ImageViewing için
                  >
                    <MaterialCommunityIcons
                      name="fullscreen"
                      size={24}
                      color={Colors.accent}
                    />
                  </TouchableOpacity>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(ev) => {
                const index = Math.round(
                  ev.nativeEvent.contentOffset.x / SCREEN_W
                );
                setCurrentIndex(index);
              }}
            />

            {/* Sol ok */}
            {currentIndex > 0 && (
              <TouchableOpacity
                style={{ position: "absolute", left: 10, top: "45%" }}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: currentIndex - 1,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={35}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            )}

            {/* Sağ ok */}
            {place.images && currentIndex < place.images.length - 1 && (
              <TouchableOpacity
                style={{ position: "absolute", right: 10, top: "45%" }}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: currentIndex + 1,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={35}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            )}
          </View>
          <ImageViewing
            images={(place.images ?? []).map((url) => ({ uri: url }))}
            imageIndex={currentIndex}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            doubleTapToZoomEnabled={false}
            HeaderComponent={({ imageIndex }) => (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 40,
                  right: 20,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderRadius: 20,
                  padding: 6,
                }}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            )}
          />

          {/* Bilgi Kartı */}
          <View style={styles.card}>
            <Text style={styles.title}>{place.name}</Text>

            {/* Mesafe */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-radius" // eski: map-marker-distance
                size={22}
                color="#6B7280" // gri ton
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{formatDistance(dist)}</Text>
            </View>

            {/* Kategori */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name={categoryIcons[place.category] || "tag"}
                size={22}
                color={categoryColors[place.category] || Colors.primaryDark}
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
                  color="#e61300ff" // kırmızı
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
                color="#1A73E8" // mavi
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                {place.latitude}, {place.longitude}
              </Text>
            </View>
            {/* İletişim Satırları */}
            {/* 📞 Telefon */}
            {place.phone && (
              <InfoRow
                icon="phone"
                label={formatPhone(place.phone)}
                onPress={() => Linking.openURL(`tel:${place.phone}`)}
              />
            )}

            {/* 📧 Mail */}
            {place.email && (
              <InfoRow
                icon="email"
                label={place.email}
                onPress={() => Linking.openURL(`mailto:${place.email}`)}
              />
            )}

            {/* 🌐 Website */}
            {place.website && (
              <InfoRow
                icon="web"
                label="Website"
                onPress={() => Linking.openURL(place.website!)}
              />
            )}

            {/* 📸 Instagram */}
            {place.instagram && (
              <InfoRow
                icon="instagram"
                label="Instagram"
                onPress={() => Linking.openURL(place.instagram!)}
              />
            )}

            {/* 📍 Yön tarifi */}
            <InfoRow
              icon="map-marker-path"
              label="Get Directions"
              onPress={handleGetDirections}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingBottom: 80, backgroundColor: Colors.background },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // küçük galeride dolsun
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
    flexDirection: "row", // ikon + yazı yanyana
    alignItems: "center", // dikeyde ortalı
    paddingVertical: 10, // yukarı-aşağı boşluk
    borderBottomWidth: 1, // altta çizgi
    borderBottomColor: "#E5E7EB", // gri çizgi
  },
  infoIcon: {
    marginRight: 10, // ikon ile yazı arası boşluk
  },
  infoText: {
    fontSize: 15,
    color: Colors.textDark,
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
  buttonText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
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

  warningText: { fontSize: 14, color: Colors.textLight, textAlign: "center" },
});
