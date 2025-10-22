import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { hideMessage } from "@/store/snackbarSlice";
import { undoLastAction } from "@/store/eventsSlice";
import {
  selectGlobalMessages,
  selectModalMessages,
} from "@/store/snackbarSelectors";

export function SnackbarContainer({
  currentRouteName,
}: {
  currentRouteName?: string;
}) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectGlobalMessages);
  const isModalPresentation =
    currentRouteName === "EventDetail" || currentRouteName === "SortModal";

  if (isModalPresentation) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {messages.map((message, index) => (
        <SnackbarItem
          key={message.id}
          message={message}
          index={index}
          onHide={() => dispatch(hideMessage(message.id))}
          isModalPresentation={false}
        />
      ))}
    </View>
  );
}

export function ModalSnackbarContainer() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectModalMessages);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {messages.map((message, index) => (
        <SnackbarItem
          key={message.id}
          message={message}
          index={index}
          onHide={() => dispatch(hideMessage(message.id))}
          isModalPresentation={true}
        />
      ))}
    </View>
  );
}
interface SnackbarItemProps {
  message: {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    scope?: "global" | "modal" | "both";
    action?: {
      label: string;
      actionType: "UNDO" | "RETRY" | "DISMISS";
      actionId?: string;
    };
    duration?: number;
  };
  index: number;
  onHide: () => void;
  isModalPresentation?: boolean;
}

const SnackbarItem: React.FC<SnackbarItemProps> = ({
  message,
  index,
  onHide,
  isModalPresentation = false,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const translateY = React.useRef(new Animated.Value(100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  const getBackgroundColor = () => {
    switch (message.type) {
      case "success":
        return "#22c55e";
      case "error":
        return "#ef4444";
      case "info":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const hideSnackbar = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [translateY, opacity, onHide]);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after duration
    const duration = message.duration || 4000;
    const timer = setTimeout(() => {
      hideSnackbar();
    }, duration);

    return () => clearTimeout(timer);
  }, [translateY, opacity, message.duration, hideSnackbar]);

  const handleActionPress = useCallback(() => {
    if (message.action) {
      switch (message.action.actionType) {
        case "UNDO":
          dispatch(undoLastAction());
          break;
        case "RETRY":
          break;
        case "DISMISS":
        default:
          break;
      }
    }
    hideSnackbar();
  }, [message.action, dispatch, hideSnackbar]);

  // Adjust bottom position based on modal presentation and safe area
  const baseBottom = isModalPresentation ? 24 : 96;
  const bottomPosition = baseBottom + insets.bottom + index * 70;

  return (
    <Animated.View
      style={[
        styles.snackbar,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
          opacity,
          bottom: bottomPosition,
        },
      ]}>
      <Text style={styles.message}>{message.message}</Text>
      {message.action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleActionPress}>
          <Text style={styles.actionText}>{message.action.label}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.closeButton} onPress={hideSnackbar}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 999999,
    elevation: 999999,
    pointerEvents: "box-none",
  },
  snackbar: {
    position: "absolute",
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 1000000,
    zIndex: 1000000,
  },
  message: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginRight: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
