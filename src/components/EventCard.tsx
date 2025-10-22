import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyText } from "./ui/MyText";
import { useThemeColor } from "../hooks/useThemeColor";
import type { Event } from "../types/index";
import { responsive, spacing, fs } from "../constants/Responsive";

interface EventCardProps {
  event: Event;
  onPress: () => void;
  variant?: "fullcard" | "horizontalcard";
  style?: ViewStyle;
}

export function EventCard({
  event,
  onPress,
  variant = "fullcard",
  style,
}: EventCardProps) {
  const textColor = useThemeColor({}, "text");
  const cardBackground = variant === "fullcard" ? "#f2f2f2" : "#FFFFFF";

  if (variant === "horizontalcard") {
    return (
      <TouchableOpacity
        style={[styles.horizontalCard, style]}
        onPress={onPress}>
        <Image
          source={{ uri: event.image }}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalInfo}>
          <MyText
            style={[styles.horizontalTitle, { color: textColor }]}
            numberOfLines={2}>
            {event.name}
          </MyText>
          <MyText
            style={[styles.horizontalDate, { color: textColor }]}
            numberOfLines={1}>
            📅 {event.date} • {event.time}
          </MyText>
          <MyText
            style={[styles.horizontalLocation, { color: textColor }]}
            numberOfLines={1}>
            📍 {event.location}
          </MyText>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.fullCard, { backgroundColor: cardBackground }, style]}
      onPress={onPress}>
      <Image
        source={{ uri: event.image }}
        style={styles.fullImage}
        resizeMode="cover"
      />
      <View style={styles.fullInfo}>
        <MyText style={[styles.fullTitle, { color: textColor }]}>
          {event.name}
        </MyText>
        <MyText style={[styles.fullDate, { color: textColor }]}>
          <Ionicons name="calendar-outline" size={16} color={textColor} />{" "}
          {event.date} • {event.time}
        </MyText>
        <MyText style={[styles.fullLocation, { color: textColor }]}>
          <Ionicons name="location-outline" size={16} color={textColor} />{" "}
          {event.location}
        </MyText>
        <View style={styles.fullFooter}>
          <MyText style={[styles.fullPrice, { color: textColor }]}>
            {event.price === 0 ? "Free" : `$${event.price}`}
          </MyText>
          <MyText style={[styles.fullSpots, { color: textColor }]}>
            {event.availableSpots} spots left
          </MyText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Full Card Styles
  fullCard: {
    borderRadius: responsive.radiusMd,
    marginBottom: spacing(16),
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fullImage: {
    width: "100%",
    height: spacing(180),
    backgroundColor: "#E0E0E0",
  },
  fullInfo: {
    padding: spacing(16),
  },
  fullTitle: {
    fontSize: fs(18),
    fontWeight: "bold",
    marginBottom: spacing(8),
  },
  fullDate: {
    fontSize: fs(14),
    marginBottom: spacing(4),
    opacity: 0.8,
  },
  fullLocation: {
    fontSize: fs(14),
    marginBottom: spacing(12),
    opacity: 0.8,
  },
  fullFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fullPrice: {
    fontSize: fs(16),
    fontWeight: "bold",
    color: "#007AFF",
  },
  fullSpots: {
    fontSize: fs(14),
    opacity: 0.7,
  },

  // Horizontal Card Styles
  horizontalCard: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: responsive.radiusMd,
    marginBottom: spacing(16),
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: spacing(100),
  },
  horizontalImage: {
    width: spacing(100),
    height: spacing(100),
  },
  horizontalInfo: {
    flex: 1,
    padding: spacing(12),
    justifyContent: "center",
  },
  horizontalTitle: {
    fontSize: fs(16),
    fontWeight: "bold",
    marginBottom: spacing(4),
  },
  horizontalDate: {
    fontSize: fs(12),
    marginBottom: spacing(2),
    opacity: 0.7,
  },
  horizontalLocation: {
    fontSize: fs(12),
    opacity: 0.7,
  },
});
