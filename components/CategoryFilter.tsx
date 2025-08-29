// components/CategoryFilter.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Easing,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (categories: string[]) => void;
  selectedCategories: string[];
  mode: "ar" | "list"; // 👈 iki mod
};

export const categories = [
  { key: "all", label: "All", icon: "apps" },
  { key: "cafe", label: "Cafe", icon: "coffee" },
  { key: "restaurant", label: "Restaurant", icon: "silverware-fork-knife" },
  { key: "dormitory", label: "Dormitory", icon: "home-group" },
  { key: "mosque", label: "Mosque", icon: "mosque" },
  { key: "library", label: "Library", icon: "book" },
  { key: "bus_stop", label: "Bus Stop", icon: "bus" },
  { key: "terminal", label: "Terminal", icon: "bus-multiple" },
  { key: "school", label: "School", icon: "school-outline" },
  { key: "university", label: "University", icon: "school" },
  { key: "faculty", label: "Faculty", icon: "domain" },
  { key: "administration", label: "Administration", icon: "office-building" },
  { key: "institute", label: "Institute", icon: "domain" },
  { key: "hospital", label: "Hospital", icon: "hospital-building" },
  { key: "health_center", label: "Health Center", icon: "medical-bag" },
  { key: "pharmacy", label: "Pharmacy", icon: "pill" },
  { key: "police", label: "Police", icon: "police-badge" },
  { key: "square", label: "Square", icon: "city" },
  { key: "post_office", label: "Post Office", icon: "email" },
  { key: "park", label: "Park", icon: "pine-tree" },
];
export const categoryColors: Record<string, string> = {
  all: Colors.accent,
  cafe: "#795548",
  restaurant: "#FF9800",
  dormitory: "#cfa20cff",
  mosque: "#3F51B5",
  library: "#110ddfff",
  bus_stop: "#037016ff",
  terminal: "#8BC34A",
  school: "#d63434ff",
  university: "#2196F3",
  faculty: "#9C27B0",
  administration: "#607D8B",
  institute: "#009688",
  hospital: "#F44336",
  health_center: "#E91E63",
  pharmacy: "#673AB7",
  police: "#000000",
  square: "#6e6968ff",
  post_office: "#FFC107",
  park: "#4CAF50",
};

// 🔹 Alt component: animasyonlu kategori ikonu
function AnimatedCategoryIcon({
  isSelected,
  icon,
  categoryKey,
}: {
  isSelected: boolean;
  icon: string;
  categoryKey: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // scale → native
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.15 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // color → js
    Animated.timing(colorAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 40,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [isSelected]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.primary, categoryColors[categoryKey] || Colors.accent],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Animated.View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 6,
          backgroundColor: animatedColor, // sadece burada renk
        }}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={isSelected ? Colors.white : Colors.primaryDark}
        />
      </Animated.View>
    </Animated.View>
  );
}

export default function CategoryFilter({
  visible,
  onClose,
  onSelect,
  selectedCategories,
  mode,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const slideAnim = useRef(new Animated.Value(-400)).current;

  // Açılış animasyonu
  useEffect(() => {
    slideAnim.setValue(visible ? 0 : -400);
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -400,
      duration: 60,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const [tempSelected, setTempSelected] =
    useState<string[]>(selectedCategories);

  useEffect(() => {
    if (mode === "list") setTempSelected(selectedCategories);
  }, [selectedCategories, visible]);

  const toggleCategory = (catKey: string) => {
    let updated: string[];
    if (catKey === "all") {
      updated = [];
      onSelect(updated);
      return;
    } else {
      if (mode === "ar") {
        if (selectedCategories.includes(catKey)) {
          updated = selectedCategories.filter((c) => c !== catKey);
        } else {
          updated = [...selectedCategories, catKey];
        }
        onSelect(updated);
      } else {
        if (tempSelected.includes(catKey)) {
          updated = tempSelected.filter((c) => c !== catKey);
        } else {
          updated = [...tempSelected, catKey];
        }
        setTempSelected(updated);
      }
    }
  };

  const renderCategories = (data: string[]) => (
    <FlatList
      data={categories.filter((c) =>
        c.label.toLowerCase().includes(searchQuery.toLowerCase())
      )}
      keyExtractor={(item) => item.key}
      numColumns={3}
      renderItem={({ item }) => {
        const isSelected =
          (item.key === "all" && data.length === 0) || data.includes(item.key);

        return (
          <Pressable
            style={styles.catItem}
            onPress={() => toggleCategory(item.key)}
          >
            <AnimatedCategoryIcon
              isSelected={isSelected}
              icon={item.icon}
              categoryKey={item.key}
            />
            <Text
              style={[
                styles.catLabel,
                isSelected
                  ? { color: categoryColors[item.key] || Colors.accent }
                  : { color: Colors.textDark },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Drawer (AR) */}
        {mode === "ar" && (
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Select Categories</Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.5}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.primaryDark}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.searchWrapper}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={Colors.primaryDark}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories..."
                placeholderTextColor={Colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            {renderCategories(selectedCategories)}
          </Animated.View>
        )}

        {/* BottomSheet (List) */}
        {mode === "list" && (
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Filter Categories</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons
                  name="filter"
                  size={24}
                  color={Colors.primaryDark}
                />
              </TouchableOpacity>
            </View>
            {renderCategories(tempSelected)}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#e5e7eb" }]}
                onPress={() => setTempSelected([])}
                activeOpacity={0.6}
              >
                <Text style={[styles.btnText, { color: Colors.textDark }]}>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: Colors.accent }]}
                onPress={() => {
                  onSelect(tempSelected);
                  onClose();
                }}
                activeOpacity={0.6}
              >
                <Text style={[styles.btnText, { color: Colors.white }]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primaryDark,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 16, // ✅ iki yandan boşluk
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
    color: Colors.textDark,
  },

  catItem: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textDark,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
