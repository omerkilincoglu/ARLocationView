// screens/HomeScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import places from "../data/places.json";
import type { Place, RootStackParamList } from "../types";
import {
  distanceMeters,
  bearingDeg,
  relativeHeadingDeg,
  clamp,
} from "../lib/geo";
import MarkerOverlay from "../components/MarkerOverlay";
import DistanceSlider from "../components/DistanceSlider";
import imageMap from "../constants/imageMap";
import InfoBar from "../components/InfoBar"; // ✅ doğru import
import { Colors } from "../constants/colors";
import CategoryFilter from "../components/CategoryFilter";
const { width: SCREEN_W } = Dimensions.get("window");
const MAX_DISTANCE_DEFAULT = 100000; // 100 km
const FOV = 60;

type Coords = { latitude: number; longitude: number };

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Home">>();
  const isARActive = route.params?.ar || false;

  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [heading, setHeading] = useState<number | null>(null);

  const [sliderRaw, setSliderRaw] = useState(0);
  const maxDistance = 300 + sliderRaw * (MAX_DISTANCE_DEFAULT - 300);

  const [paused, setPaused] = useState(false);
  const lastMarkersRef = useRef<{ place: Place; dist: number; rel: number }[]>(
    []
  );

  const lastHeadingRef = useRef(0);
  const smoothAngle = (prev: number, next: number, alpha = 0.15) => {
    const diff = ((next - prev + 540) % 360) - 180;
    return (prev + alpha * diff + 360) % 360;
  };

  // 📍 Konum alma
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCurrentAddress("Permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const geocode = await Location.reverseGeocodeAsync(loc.coords);

      if (geocode.length > 0) {
        const place = geocode[0];
        setCurrentAddress(
          `${place.name || ""} ${place.street || ""} ${
            place.district || place.subregion || ""
          }, ${place.city || place.region || ""}, ${place.country || ""}`
        );
      } else {
        setCurrentAddress(
          `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(
            4
          )}`
        );
      }
    } catch {
      setCurrentAddress("Location error");
    }
  };

  // 📍 İlk açılışta izinleri iste
  useEffect(() => {
    (async () => {
      await requestCameraPermission();
      await fetchLocation();
    })();
  }, []);

  // 📍 AR sensörleri
  useEffect(() => {
    if (!isARActive) return;
    if (!cameraPermission?.granted) return;

    let locSub: Location.LocationSubscription | null = null;
    let headSub: { remove: () => void } | null = null;

    const startSensors = async () => {
      const cur = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setCoords(cur.coords);

      locSub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1500,
          distanceInterval: 5,
        },
        (loc) => {
          const last = coords;
          if (last) {
            const d = distanceMeters(last, loc.coords);
            if (d < 2) return; // 🔑 2 metreden küçük hareketi yok say
          }
          setCoords(loc.coords);
        }
      );

      headSub = await Location.watchHeadingAsync((h) => {
        if (h.trueHeading && h.trueHeading > 0) {
          const diff = Math.abs(h.trueHeading - lastHeadingRef.current);
          if (diff < 2) return; // 🔑 küçük dalgalanmaları yok say (2° altında)
          const blended = smoothAngle(lastHeadingRef.current, h.trueHeading);
          lastHeadingRef.current = blended;
          setHeading(blended);
        }
      });
    };
    startSensors();

    return () => {
      locSub?.remove();
      headSub?.remove();
    };
  }, [isARActive, cameraPermission?.granted]);

  // 📍 Marker filtreleme
  // 📍 Markerları hesapla ve ekranda gösterilecek listeyi döndür
  // - Eğer pause aktif değilse: yeni markerleri hesapla ve kaydet
  // - Eğer pause aktifse: yeni hesaplananları değil, en son kaydedilen markerleri göster (sabit kalıyor)
  const filteredMarkers = useMemo(() => {
    if (!coords || heading === null) return [];

    const newMarkers = (places as Place[])
      .filter(
        (p) =>
          selectedCategories.length === 0 ||
          selectedCategories.includes(p.category)
      )
      .map((p) => {
        const dist = distanceMeters(coords, p);
        const bear = bearingDeg(coords, p);
        const rel = relativeHeadingDeg(bear, heading);
        return { place: p, dist, rel };
      })
      .filter((m) => m.dist <= maxDistance)
      .sort((a, b) => a.dist - b.dist);

    // eğer pause değilse yeni markerleri güncelle
    if (!paused) {
      lastMarkersRef.current = newMarkers;
    }

    // eğer pause ise son bilinen markerleri göster
    return paused ? lastMarkersRef.current : newMarkers;
  }, [coords, heading, maxDistance, selectedCategories, paused]);

  /** 📌 Normal Mod **/
  if (!isARActive) {
    return (
      <View style={styles.safeArea}>
        <Image
          source={require("../assets/home.png")}
          style={styles.homeImage}
          resizeMode="cover"
        />

        <InfoBar mode="top" currentAddress={currentAddress} />
        <InfoBar mode="bottom" navigation={navigation} />
      </View>
    );
  }

  /** 📌 AR Mod **/
  return (
    <View style={styles.safeAreaAR}>
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
      <InfoBar mode="filter" onPress={() => setFilterVisible(true)} />
      <InfoBar mode="bottom" navigation={navigation} />

      {/* Markerlar */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {filteredMarkers.map((m, index) => {
          const angle = m.rel;
          const xBase = SCREEN_W / 2 + (angle / (FOV / 2)) * (SCREEN_W / 2);
          const isVisible = Math.abs(angle) <= FOV / 2;
          if (isVisible) {
            let y = 120 + Math.min(320, Math.max(0, m.dist / 18));
            const t = clamp((m.dist - 300) / (maxDistance - 300), 0, 1);
            const scale = clamp(1.1 - 0.3 * t, 0.9, 1.1);
            const opacity = clamp(1.2 - 0.3 * t, 0.6, 1);

            // 🔹 Markerları biraz dağıtmak için offset ekledik
            const offsetX = ((index % 3) - 1) * 80; // -80, 0, +80 px
            const offsetY = ((index % 2) - 0.5) * 60; // -30, +30 px

            return (
              <View
                key={m.place.id}
                style={{
                  position: "absolute",
                  left: xBase + offsetX,
                  top: y + offsetY,
                  transform: [{ translateX: -90 }, { scale }],
                  opacity,
                }}
              >
                <MarkerOverlay
                  place={m.place}
                  dist={m.dist}
                  onPress={() =>
                    navigation.navigate("PlaceDetail", {
                      place: m.place,
                      dist: m.dist,
                    })
                  }
                  imageMap={imageMap}
                />
              </View>
            );
          }
          return null;
        })}
      </View>

      {/* Mesafe Slider */}
      <DistanceSlider
        sliderRaw={sliderRaw}
        setSliderRaw={setSliderRaw}
        maxDistance={maxDistance}
      />
      {/* Pause / Resume Button */}
      <View style={styles.pauseBtnWrapper}>
        <TouchableOpacity
          onPress={() => setPaused(!paused)}
          style={styles.pauseBtn}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={paused ? "play" : "pause"}
            size={28}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Filtre Modal */}
      <CategoryFilter
        mode="ar"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onSelect={(cats: string[]) => setSelectedCategories(cats)} // çoklu seçim
        selectedCategories={selectedCategories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  safeAreaAR: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  homeImage: {
    width: "100%",
    height: "100%",
  },
  pauseBtnWrapper: {
    position: "absolute", // 🔑 buton bağımsız dursun
    right: 15, // slider hizasına gelsin
    bottom: "23%", // slider’ın hemen altına otursun
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30, // markerların üstünde kalsın
  },
  pauseBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
