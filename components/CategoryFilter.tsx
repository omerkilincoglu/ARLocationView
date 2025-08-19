// components/CategoryFilter.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
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
];

export default function CategoryFilter({
  visible,
  onClose,
  onSelect,
  selectedCategories,
  mode,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const slideAnim = useRef(new Animated.Value(-400)).current;

  // Animasyon
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -400,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);
  const toggleCategory = (catKey: string) => {
    let updated: string[];
    if (catKey === "all") {
      updated = [];
    } else {
      if (mode === "ar") {
        // AR mod → selectedCategories kullan
        if (selectedCategories.includes(catKey)) {
          updated = selectedCategories.filter((c) => c !== catKey);
        } else {
          updated = [...selectedCategories, catKey];
        }
        onSelect(updated); // ✅ AR modda anında uygula
      } else {
        // LIST mod → tempSelected kullan
        if (tempSelected.includes(catKey)) {
          updated = tempSelected.filter((c) => c !== catKey);
        } else {
          updated = [...tempSelected, catKey];
        }
        setTempSelected(updated); // ✅ sadece local state güncellenir
      }
    }
  };

  // List moduna özel geçici seçim state
  const [tempSelected, setTempSelected] =
    useState<string[]>(selectedCategories);
  useEffect(() => {
    if (mode === "list") setTempSelected(selectedCategories);
  }, [selectedCategories, visible]);

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
          <TouchableOpacity
            style={styles.catItem}
            onPress={() => toggleCategory(item.key)}
            activeOpacity={0.7} // basınca opacity düşer
          >
            <View
              style={[
                styles.iconWrapper,
                isSelected
                  ? { backgroundColor: Colors.accent }
                  : { backgroundColor: Colors.primary },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={isSelected ? Colors.white : Colors.primaryDark}
              />
            </View>
            <Text
              style={[
                styles.catLabel,
                isSelected
                  ? { color: Colors.accent }
                  : { color: Colors.textDark },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
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
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.primaryDark}
                />
              </TouchableOpacity>
            </View>
            {/* Search */}
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
                  name="close"
                  size={24}
                  color={Colors.primaryDark}
                />
              </TouchableOpacity>
            </View>
            {renderCategories(tempSelected)}

            {/* Apply & Clear butonları */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#e5e7eb" }]}
                onPress={() => setTempSelected([])}
                activeOpacity={0.7}
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
                activeOpacity={0.7}
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
    backgroundColor: "#f1f5f9",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
  },
  catItem: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
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
