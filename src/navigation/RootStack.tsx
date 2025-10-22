import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { LoginScreen } from "../screens/Auth/LoginScreen";
import { SignUpScreen } from "../screens/Auth/SignUpScreen";
import { EventListScreen } from "../screens/Events/EventListScreen";
import { EventDetailScreen } from "../screens/Events/EventDetailScreen";
import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { NotFound } from "../screens/NotFound";

import { SnackbarContainer } from "@/components/Snackbar";
import { Ionicons } from "@expo/vector-icons";

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Auth: undefined;
      Login: undefined;
      SignUp: undefined;
      Main: undefined;
      Events: undefined;
      Dashboard: undefined;
      EventDetail: { eventId: string };
      NotFound: undefined;
    }
  }
}
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// Main App Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: {
          borderTopEndRadius: 16,
          borderTopLeftRadius: 16,
          shadowColor: "#111",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.5,

          elevation: 5,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
        },
      }}>
      <Tab.Screen
        name="Events"
        component={EventListScreen}
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "My Events",
          tabBarIcon: ({ color }) => (
            <Ionicons name="man-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack
function RootStack() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetailScreen}
            options={{
              headerShown: true,
              title: "Event Details",
              presentation: "modal",
            }}
          />
        </>
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFound}
        options={{ title: "404" }}
      />
    </Stack.Navigator>
  );
}

export function Navigation({ theme, linking, onReady }: any) {
  const routeNameRef = React.useRef<string | undefined>(undefined);
  const navigationRef = React.useRef<any>(null);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      linking={linking}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        onReady?.();
      }}
      onStateChange={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}>
      <RootStack />
      <SnackbarContainer currentRouteName={routeNameRef.current} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
