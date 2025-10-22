import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { responsive, spacing, ms } from "@/constants/Responsive";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

interface MyTextInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value"> {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  placeHolder?: string;
  // Right icon props
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  rightIconStyle?: StyleProp<ViewStyle>;
  // React Hook Form props
  name?: Path<T>;
  control?: Control<T>;
  rules?: object;
  value?: any;
}

// For standalone use without React Hook Form
function MyTextInputBase<T extends FieldValues>({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  onFocus,
  onBlur,
  value,
  placeHolder = "Enter text",
  rightIcon,
  onRightIconPress,
  rightIconStyle,
  ...restProps
}: MyTextInputProps<T> & { value?: string }) {
  // Animation values
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const focusAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;

  // State for tracking focus
  const [isFocused, setIsFocused] = useState(false);

  // Handle animations when focus or value changes
  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [labelAnim, focusAnim, isFocused, value]);

  // Handle error animation
  useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [error, errorAnim]);

  // Handle input focus
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  // Handle input blur
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  // Border animation
  const borderColor = error
    ? "#FF3B30"
    : focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#5C5C5B33", "#007AFF"],
      });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Animated floating label */}
      <Animated.Text
        style={[styles.label, labelStyle, error && { color: "#FF3B30" }]}>
        {label}
      </Animated.Text>

      {/* Input with animated border */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderWidth: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.5],
            }),
            backgroundColor: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["#f7f7f7", "#ffff"],
            }),
          },
        ]}>
        <TextInput
          placeholderTextColor="#999"
          placeholder={placeHolder}
          style={[
            styles.input,
            inputStyle,
            rightIcon ? styles.inputWithIcon : null,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          {...restProps}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={[styles.rightIconContainer, rightIconStyle]}
            activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Animated error message */}
      <Animated.Text
        style={[
          styles.errorText,
          errorStyle,
          {
            opacity: errorAnim,
            transform: [
              {
                translateY: errorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
        ]}>
        {error}
      </Animated.Text>
    </View>
  );
}

// Main component that can be used with React Hook Form
function MyTextInput<T extends FieldValues = FieldValues>(
  props: MyTextInputProps<T>
) {
  const { name, control, rules, ...rest } = props;

  // If name and control are provided, use with React Hook Form
  if (name && control) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <MyTextInputBase
            {...rest}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
          />
        )}
      />
    );
  }

  // Otherwise, use as a standalone component
  return <MyTextInputBase {...rest} />;
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    borderRadius: responsive.radiusSm,
    height: ms(40),
    justifyContent: "center",
    paddingHorizontal: spacing(8),
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: responsive.fontMd,
    color: "#000",
    flex: 1,
  },
  inputWithIcon: {
    paddingRight: spacing(8),
  },
  rightIconContainer: {
    padding: spacing(4),
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#333",
    fontWeight: "600",
    fontSize: responsive.fontSm,
    paddingBottom: spacing(4),
  },
  errorText: {
    color: "#FF3B30",
    fontSize: responsive.fontSm,
    marginVertical: spacing(4),
  },
});

export default MyTextInput;
