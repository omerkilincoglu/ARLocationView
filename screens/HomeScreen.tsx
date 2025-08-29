// screens/HomeScreen.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
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
import InfoBar from "../components/InfoBar";
import { Colors } from "../constants/colors";
import CategoryFilter from "../components/CategoryFilter";

const { width: SCREEN_W } = Dimensions.get("window");
const MAX_DISTANCE_DEFAULT = 70000; // 70 km
const FOV = 60;

type Coords = { latitude: number; longitude: number };

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Home">>();
  const isARActive = route.params?.ar || false;
  const isFocused = useIsFocused();

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
  const headingBuffer = useRef<number[]>([]);
  const smoothAngle = (prev: number, next: number, alpha = 0.05) => {
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
  useFocusEffect(
    useCallback(() => {
      if (!isARActive) return;
      if (!cameraPermission || !cameraPermission.granted) return;

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
              if (d < 1) return;
            }
            setCoords(loc.coords);
          }
        );

        headSub = await Location.watchHeadingAsync((h) => {
          if (h.trueHeading && h.trueHeading > 0) {
            const corrected = h.trueHeading;
            const diff = Math.abs(corrected - lastHeadingRef.current);

            // 📌 Telefon sabitse (1° altında oynama) → hiç güncelleme
            if (diff < 1.0) return;

            // 📌 Telefon dönmeye başladı → hızlı tepki
            const alpha = 0.25;

            const blended = smoothAngle(
              lastHeadingRef.current,
              corrected,
              alpha
            );

            // Ortalama için buffer
            headingBuffer.current.push(blended);
            if (headingBuffer.current.length > 8) {
              headingBuffer.current.shift();
            }

            const avg =
              headingBuffer.current.reduce((a, b) => a + b, 0) /
              headingBuffer.current.length;

            // Yuvarlama (0.5° hassasiyet)
            const rounded = Math.round(avg * 2) / 2;

            lastHeadingRef.current = rounded;
            setHeading(rounded);
          }
        });
      };

      startSensors();

      return () => {
        locSub?.remove();
        headSub?.remove();
      };
    }, [isARActive, cameraPermission])
  );

  // 📍 Marker filtreleme
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
        let rel = relativeHeadingDeg(bear, heading);
        if (Math.abs(rel) < 1) rel = 0;
        return { place: p, dist: Math.round(dist), rel };
      })
      .filter((m) => m.dist <= maxDistance)
      .sort((a, b) => a.dist - b.dist);

    if (!paused) lastMarkersRef.current = newMarkers;
    return paused ? lastMarkersRef.current : newMarkers;
  }, [coords, heading, maxDistance, selectedCategories, paused]);

  // ✅ Tek return, koşullu render içeride
  return (
    <SafeAreaView
      style={isARActive ? styles.safeAreaAR : styles.safeArea}
      edges={["top", "bottom"]}
    >
      {!isARActive ? (
        <>
          <Image
            source={require("../assets/home.png")}
            style={styles.homeImage}
            resizeMode="cover"
          />
          <InfoBar mode="top" currentAddress={currentAddress} />
          <InfoBar mode="bottom" navigation={navigation} />
        </>
      ) : (
        <>
          {isFocused && cameraPermission?.granted && (
            <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
          )}

          <InfoBar mode="bottom" navigation={navigation} />
          {/* Markerlar */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            {filteredMarkers.map((m, index) => {
              const angle = m.rel;
              const xBase = SCREEN_W / 2 + (angle / (FOV / 2)) * (SCREEN_W / 2);
              const isVisible = Math.abs(angle) <= FOV / 2;
              if (!isVisible) return null;

              let y = 120 + Math.min(320, Math.max(0, m.dist / 18));
              const t = clamp((m.dist - 300) / (maxDistance - 300), 0, 1);
              const scale = clamp(1.1 - 0.3 * t, 0.9, 1.1);
              const opacity = clamp(1.2 - 0.3 * t, 0.6, 1);
              const offsetX = ((index % 3) - 1) * 80;
              const offsetY = ((index % 2) - 0.5) * 60;

              return (
                <View
                  key={m.place.id}
                  style={{
                    position: "absolute",
                    left: xBase + offsetX,
                    top: y + offsetY,
                    transform: [{ translateX: -90 }, { scale }],
                    opacity,
                    zIndex: Math.round(100000 - m.dist), // ✅ yakındaki marker üste
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
                  />
                </View>
              );
            })}
          </View>

          {/* Mesafe Slider */}
          <DistanceSlider
            sliderRaw={sliderRaw}
            setSliderRaw={setSliderRaw}
            maxDistance={maxDistance}
          />

          <InfoBar mode="filter" onPress={() => setFilterVisible(true)} />

          {/* Pause Button */}
          <View style={styles.pauseBtnWrapper}>
            <TouchableOpacity
              onPress={() => setPaused(!paused)}
              style={styles.pauseBtn}
              activeOpacity={0.6}
            >
              <MaterialCommunityIcons
                name={paused ? "play" : "pause"}
                size={26}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* Filtre Modal */}
          <CategoryFilter
            mode="ar"
            visible={filterVisible}
            onClose={() => setFilterVisible(false)}
            onSelect={(cats: string[]) => setSelectedCategories(cats)}
            selectedCategories={selectedCategories}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  safeAreaAR: { flex: 1, backgroundColor: "black" },
  homeImage: { width: "100%", height: "100%" },

  pauseBtnWrapper: {
    position: "absolute",
    right: 15,
    bottom: "12%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
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
