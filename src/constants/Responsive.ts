import { Dimensions, PixelRatio } from "react-native";

// Get device dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Base dimensions (design reference)
const baseWidth = 375; // iPhone X width as base
const baseHeight = 812; // iPhone X height as base

// Calculate scale factors
const widthScale = screenWidth / baseWidth;
const heightScale = screenHeight / baseHeight;

/**
 * Responsive width based on screen width
 * @param size - The size from design (based on 375px width)
 * @returns Scaled width for current device
 */
export const wp = (size: number): number => {
  const newSize = size * widthScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Responsive height based on screen height
 * @param size - The size from design (based on 812px height)
 * @returns Scaled height for current device
 */
export const hp = (size: number): number => {
  const newSize = size * heightScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Responsive font size with moderate scaling
 * @param size - The font size from design
 * @returns Scaled font size for current device
 */
export const fs = (size: number): number => {
  const scale = Math.min(widthScale, heightScale);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Moderate scale - uses the smaller of width/height scale
 * Good for elements that shouldn't scale too much
 * @param size - The size from design
 * @param factor - Scale factor (default: 0.5)
 * @returns Moderately scaled size
 */
export const ms = (size: number, factor: number = 0.5): number => {
  const scale = Math.min(widthScale, heightScale);
  const newSize = size + (scale - 1) * size * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Responsive padding/margin
 * @param size - The padding/margin size from design
 * @returns Scaled padding/margin for current device
 */
export const spacing = (size: number): number => {
  return wp(size);
};

// Screen dimensions for reference
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
  isSmallDevice: screenWidth < 375,
  isMediumDevice: screenWidth >= 375 && screenWidth < 414,
  isLargeDevice: screenWidth >= 414,
  isTablet: screenWidth >= 768,
};

// Common responsive values
export const responsive = {
  // Common spacings
  xs: spacing(4),
  sm: spacing(8),
  md: spacing(12),
  lg: spacing(16),
  xl: spacing(20),
  xxl: spacing(24),
  xxxl: spacing(32),

  // Common font sizes
  fontXs: fs(10),
  fontSm: fs(12),
  fontMd: fs(14),
  fontLg: fs(16),
  fontXl: fs(18),
  fontXxl: fs(20),
  fontXxxl: fs(24),

  // Button heights
  buttonSm: hp(32),
  buttonMd: hp(44),
  buttonLg: hp(56),

  // Icon sizes
  iconSm: ms(16),
  iconMd: ms(20),
  iconLg: ms(24),
  iconXl: ms(28),

  // Border radius
  radiusXs: ms(4),
  radiusSm: ms(8),
  radiusMd: ms(12),
  radiusLg: ms(16),
  radiusXl: ms(20),
};

export default responsive;
