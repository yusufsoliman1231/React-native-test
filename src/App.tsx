import "react-native-reanimated";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { Colors } from "./constants/Colors";
import { Navigation } from "./navigation/RootStack";
import { store } from "./store";
import { AuthProvider, setAuthContextInstance, useAuth } from "./contexts";

SplashScreen.preventAutoHideAsync();

/**
 * Navigation wrapper component that connects AuthContext to axios instance
 */
function NavigationWrapper() {
  const authContext = useAuth();

  // Connect AuthContext to axios instance for token retrieval
  React.useEffect(() => {
    setAuthContextInstance(authContext);
  }, [authContext]);

  const colorScheme = useColorScheme();

  const theme =
    colorScheme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: Colors[colorScheme ?? "light"].tint,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: Colors[colorScheme ?? "light"].tint,
          },
        };

  return (
    <Navigation
      theme={theme}
      linking={{
        enabled: "auto",
        prefixes: ["booklibrary://"],
      }}
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    />
  );
}

export function App() {
  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <KeyboardProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <SafeAreaView
              style={{
                flex: 1,
              }}>
              <NavigationWrapper />
            </SafeAreaView>
          </SafeAreaProvider>
        </AuthProvider>
      </KeyboardProvider>
    </Provider>
  );
}
