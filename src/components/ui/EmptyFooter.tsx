import React from "react";
import { View, ViewStyle } from "react-native";
import { spacing } from "@/constants/Responsive";

type FooterSize = "sm" | "md" | "lg" | "xl" | "xxl" | "tabBar" | "safeArea";

interface EmptyFooterProps {
  size?: FooterSize;
  height?: number;
  style?: ViewStyle;
}

export const EmptyFooter: React.FC<EmptyFooterProps> = ({
  size = "md",
  height,
  style,
}) => {
  const getFooterHeight = (): number => {
    // If custom height is provided, use that
    if (height !== undefined) {
      return height;
    }

    // Otherwise use predefined sizes
    switch (size) {
      case "sm":
        return spacing(8);
      case "md":
        return spacing(16);
      case "lg":
        return spacing(24);
      case "xl":
        return spacing(32);
      case "xxl":
        return spacing(48);
      case "tabBar":
        return spacing(80); // Space for bottom tab bar
      case "safeArea":
        return spacing(40); // Space for safe area
      default:
        return spacing(16);
    }
  };

  return (
    <View
      style={[
        {
          height: getFooterHeight(),
          width: "100%",
        },
        style,
      ]}
    />
  );
};

export default EmptyFooter;
