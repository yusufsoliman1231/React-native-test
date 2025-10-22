import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { responsive, spacing } from "@/constants/Responsive";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface MyButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const MyButton: React.FC<MyButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const textColor = useThemeColor({}, "text");

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: responsive.radiusMd,
      opacity: disabled || loading ? 0.6 : 1,
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      sm: {
        paddingHorizontal: spacing(12),
        paddingVertical: spacing(8),
        minHeight: responsive.buttonSm,
      },
      md: {
        paddingHorizontal: spacing(16),
        paddingVertical: spacing(12),
        minHeight: responsive.buttonMd,
      },
      lg: {
        paddingHorizontal: spacing(20),
        paddingVertical: spacing(16),
        minHeight: responsive.buttonLg,
      },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: "#3b82f6",
      },
      secondary: {
        backgroundColor: "#6b7280",
      },
      danger: {
        backgroundColor: "#ef4444",
      },
      success: {
        backgroundColor: "#10b981",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: textColor,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: "100%" }),
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    const sizeTextStyles: Record<ButtonSize, TextStyle> = {
      sm: { fontSize: responsive.fontSm },
      md: { fontSize: responsive.fontMd },
      lg: { fontSize: responsive.fontLg },
    };

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: "white" },
      secondary: { color: "white" },
      danger: { color: "white" },
      success: { color: "white" },
      outline: { color: textColor },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}>
      {icon && !title && <>{icon}</>}
      {title && (
        <ThemedText
          style={[
            getTextStyles(),
            ...(icon && title ? [{ marginLeft: spacing(8) }] : []),
            textStyle,
          ]}>
          {loading ? "Loading..." : title}
        </ThemedText>
      )}
      {icon && title && <>{icon}</>}
    </TouchableOpacity>
  );
};
