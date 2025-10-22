import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { responsive } from "@/constants/Responsive";

type TextVariant =
  | "display"
  | "headline"
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "overline";

type TextWeight = "light" | "regular" | "medium" | "semibold" | "bold";

interface MyTextProps extends TextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  center?: boolean;
  uppercase?: boolean;
  underline?: boolean;
  italic?: boolean;
}

export const MyText: React.FC<MyTextProps> = ({
  variant = "body",
  weight = "regular",
  color,
  center = false,
  uppercase = false,
  underline = false,
  italic = false,
  style,
  children,
  ...props
}) => {
  const themeColor = useThemeColor({}, "text");

  const getVariantStyles = (): TextStyle => {
    const variantStyles: Record<TextVariant, TextStyle> = {
      display: {
        fontSize: responsive.fontXs + 8, // 32px base
        fontWeight: "700",
      },
      headline: {
        fontSize: responsive.fontXxxl, // 24px base
        fontWeight: "600",
      },
      title: {
        fontSize: responsive.fontLg, // 20px base
        fontWeight: "600",
      },
      subtitle: {
        fontSize: responsive.fontMd, // 18px base
        fontWeight: "500",
      },
      body: {
        fontSize: responsive.fontSm, // 14px base
        fontWeight: "400",
      },
      caption: {
        fontSize: responsive.fontSm, // 12px base
        fontWeight: "400",
      },
      overline: {
        fontSize: responsive.fontXs, // 10px base
        fontWeight: "500",
        letterSpacing: 1.5,
      },
    };

    return variantStyles[variant];
  };

  const getWeightStyles = (): TextStyle => {
    const weightStyles: Record<TextWeight, TextStyle> = {
      light: { fontWeight: "300" },
      regular: { fontWeight: "400" },
      medium: { fontWeight: "500" },
      semibold: { fontWeight: "600" },
      bold: { fontWeight: "700" },
    };

    return weightStyles[weight];
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: "SpaceMono", // Default app font
      color: color || themeColor,
      ...(center && { textAlign: "center" }),
      ...(uppercase && { textTransform: "uppercase" }),
      ...(underline && { textDecorationLine: "underline" }),
      ...(italic && { fontStyle: "italic" }),
    };

    return {
      ...baseStyle,
      ...getVariantStyles(),
      ...getWeightStyles(),
    };
  };

  return (
    <Text style={[getTextStyles(), style]} {...props}>
      {children}
    </Text>
  );
};

// Convenience components for common text variants
export const DisplayText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="display" {...props} />
);

export const HeadlineText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="headline" {...props} />
);

export const TitleText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="title" {...props} />
);

export const SubtitleText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="subtitle" {...props} />
);

export const BodyText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="body" {...props} />
);

export const CaptionText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="caption" {...props} />
);

export const OverlineText: React.FC<Omit<MyTextProps, "variant">> = (props) => (
  <MyText variant="overline" {...props} />
);
