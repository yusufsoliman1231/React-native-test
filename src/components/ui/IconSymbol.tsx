// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Partial<
  Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>
>;
const DEFAULT_ICON: ComponentProps<typeof MaterialIcons>["name"] =
  "help-outline";

const warnedMissingIcons = new Set<string>();

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  book: "book",
  "book.fill": "book",
  magnifyingglass: "search",
  "slider.horizontal.3": "tune",
  house: "home",
} as IconMapping;

const resolveIconName = (name: SymbolViewProps["name"]) => {
  const mappedName = MAPPING[name];

  if (mappedName) {
    return mappedName;
  }

  if (__DEV__ && !warnedMissingIcons.has(name)) {
    console.warn(
      `[IconSymbol] Missing Material icon mapping for symbol "${name}". Falling back to "${DEFAULT_ICON}".`
    );
    warnedMissingIcons.add(name);
  }

  return DEFAULT_ICON;
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
type IconSymbolProps = {
  name: SymbolViewProps["name"];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight: _weight,
}: IconSymbolProps) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={resolveIconName(name)}
      style={style}
    />
  );
}
