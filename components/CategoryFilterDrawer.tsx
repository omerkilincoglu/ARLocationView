// components/CategoryFilterDrawer.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
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
};

const categories = [
  { key: "all", label: "All", icon: "apps" },
  { key: "cafe", label: "Cafe", icon: "coffee" },
  { key: "mosque", label: "Mosque", icon: "mosque" },
  { key: "library", label: "Library", icon: "book" },
  { key: "bus_stop", label: "Bus Stop", icon: "bus" },
  { key: "faculty", label: "Faculty", icon: "school" },
  { key: "administration", label: "Administration", icon: "office-building" },
  { key: "post_office", label: "Post Office", icon: "email" },
  { key: "square", label: "Square", icon: "city" },
  { key: "institute", label: "Institute", icon: "domain" },
];

export default function CategoryFilterDrawer({
  visible,
  onClose,
  onSelect,
  selectedCategories,
}: Props) {
  const slideAnim = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -400,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const toggleCategory = (catKey: string) => {
    let updated: string[] = [];
    if (catKey !== "all") {
      if (selectedCategories.includes(catKey)) {
        updated = selectedCategories.filter((c) => c !== catKey);
      } else {
        updated = [...selectedCategories, catKey];
      }
    }
    onSelect(updated);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={{ flex: 1 }}>
        {/* Arkayı kaplayan overlay */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Alttan gelen kart */}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateX: slideAnim }] }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Categories</Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={Colors.primaryDark}
              />
            </Pressable>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.key}
            numColumns={3} // 👈 3’lü grid
            renderItem={({ item }) => {
              const isSelected =
                (item.key === "all" && selectedCategories.length === 0) ||
                selectedCategories.includes(item.key);

              return (
                <Pressable
                  style={styles.catItem}
                  onPress={() => toggleCategory(item.key)}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      isSelected
                        ? { backgroundColor: Colors.accent }
                        : { backgroundColor: Colors.primaryLight },
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
                </Pressable>
              );
            }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute", // ✅ tam ekran kaplasın
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.0)", // ✅ siyah şeffaf, beyaz parlamaz
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
});
