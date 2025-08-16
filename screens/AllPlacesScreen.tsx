// screens/AllPlacesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCurrentPositionAsync, Accuracy } from "expo-location";

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

  // Kullanıcının konumunu al
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

  // Mesafe hesaplanmış liste
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
            style={styles.item}
            onPress={() =>
              navigation.navigate("PlaceDetail", {
                place: item,
                dist: item.dist,
              })
            }
          >
            <Image
              source={imageMap[item.image]}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.distance}>
                {coords ? formatDistance(item.dist) : "Calculating..."}
              </Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: Colors.backgroundDark,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMedium,
  },
  category: {
    fontSize: 14,
    color: Colors.textDark,
    marginTop: 2,
  },
  distance: {
    fontSize: 13,
    color: Colors.accent,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.backgroundDark,
    marginHorizontal: 10,
  },
});
