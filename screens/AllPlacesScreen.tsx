// screens/AllPlacesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCurrentPositionAsync, Accuracy } from "expo-location";
import { Image } from "expo-image";

import type { Place, RootStackParamList } from "../types";
import places from "../data/places.json";
import imageMap from "../constants/imageMap";
import { Colors } from "../constants/colors";
import { distanceMeters, formatDistance } from "../lib/geo";

export default function AllPlacesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 📍 Kullanıcının konumunu al
  useEffect(() => {
    const getLocation = async () => {
      try {
        const loc = await getCurrentPositionAsync({
          accuracy: Accuracy.BestForNavigation,
        });
        setCoords(loc.coords);
      } catch (err) {
        console.log("Location could not be obtained", err);
      }
    };
    getLocation();
  }, []);

  // 📍 Mesafe hesaplanmış liste
  const dataWithDistance = (places as Place[])
    .map((p) => {
      const dist = coords ? distanceMeters(coords, p) : 0;
      return { ...p, dist };
    })
    .sort((a, b) => a.dist - b.dist);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
      }}
    >
      <FlatList
        data={dataWithDistance}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("PlaceDetail", {
                place: item,
                dist: item.dist,
              })
            }
          >
            {/* Fotoğraf (güvenli fallback ile) */}
            {imageMap[item.image as keyof typeof imageMap] ? (
              <Image
                source={imageMap[item.image as keyof typeof imageMap]}
                style={styles.cardImage}
                contentFit="cover" // ✅ yeni yöntem
                transition={300} // ✅ fade-in animasyonu
              />
            ) : (
              <View
                style={[
                  styles.cardImage,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text style={{ color: Colors.textLight, fontSize: 12 }}>
                  {"\u26A0"} No Image
                </Text>
              </View>
            )}

            {/* Bilgi kısmı */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>

              <View style={styles.row}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.distance}>
                  {coords ? formatDistance(item.dist) : "Calculating..."}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={8} // ✅ performans
        windowSize={10} // ✅ performans
        removeClippedSubviews={true} // ✅ performans
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.backgroundDark,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textDark,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: "600",
  },
  distance: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.backgroundDark,
    marginHorizontal: 10,
  },
});
