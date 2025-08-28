// screens/AllPlacesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCurrentPositionAsync, Accuracy } from "expo-location";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { Place, RootStackParamList } from "../types";
import places from "../data/places.json";
import { Colors } from "../constants/colors";
import { distanceMeters, formatDistance } from "../lib/geo";
import CategoryFilter from "../components/CategoryFilter";
import ImageWithFallback from "../components/ImageWithFallback";

export default function AllPlacesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // 📍 Arama + filtreleme
  const filteredData = dataWithDistance.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter.length > 0 ? activeFilter.includes(item.category) : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.white }}
      edges={["top", "bottom"]}
    >
      {/* 🔍 Search + Filter Row */}
      <View style={styles.header}>
        <View style={styles.searchWrapper}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={Colors.primaryDark}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in all places..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsFilterOpen(true)}
          activeOpacity={0.6}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={22}
            color={Colors.primaryDark}
          />
        </TouchableOpacity>
      </View>

      {/* 🏷️ Aktif filtre chip */}
      {activeFilter.length > 0 && (
        <View style={styles.chipRow}>
          {activeFilter.map((cat) => (
            <View key={cat} style={styles.chip}>
              <Text style={styles.chipText}>{cat}</Text>
              <TouchableOpacity
                onPress={() =>
                  setActiveFilter(activeFilter.filter((c) => c !== cat))
                }
                style={styles.closeBtn}
                activeOpacity={0.6}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color={"#e5e7eb"} // soft gri
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 📋 Liste */}
      <FlatList
        data={filteredData}
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
            {item.images && item.images.length > 0 ? (
              <Image
                source={{ uri: item.images[0] }}
                style={styles.cardImage}
                contentFit="cover"
                transition={300}
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
        initialNumToRender={8}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* 🎛️ Filtre Drawer */}
      <CategoryFilter
        mode="list"
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategories={activeFilter}
        onSelect={(cats: string[]) => {
          setActiveFilter(cats);
          setIsFilterOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 6,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
    color: Colors.textDark,
  },
  filterBtn: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    marginBottom: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 50, 149, 0.9)", // primaryDark transparan
    marginRight: 6,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  chipText: {
    fontSize: 13,
    color: Colors.white,
    marginRight: 4,
    fontWeight: "600",
  },
  closeBtn: {
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
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
