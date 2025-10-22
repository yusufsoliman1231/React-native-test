import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useGetRegisteredEventsQuery } from "../../services/api";
import { useAuth } from "../../contexts";
import { MyText } from "../../components/ui/MyText";
import { MyButton } from "../../components/ui/MyButton";
import { EventCard } from "../../components/EventCard";
import { useThemeColor } from "../../hooks/useThemeColor";
import type { Registration } from "../../types/index";
import { responsive, spacing, fs } from "../../constants/Responsive";

export function DashboardScreen({ navigation }: any) {
  const { user: currentUser, logout: authLogout } = useAuth();
  const {
    data: registeredEvents,
    isLoading,
    refetch,
  } = useGetRegisteredEventsQuery(currentUser?.id || "", {
    skip: !currentUser,
  });

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          authLogout();
          // Navigation will automatically switch to Auth stack via RootStack
        },
      },
    ]);
  };

  const renderEventItem = ({ item }: { item: Registration }) => {
    if (!item.event) return null;

    return (
      <EventCard
        event={item.event}
        variant="horizontalcard"
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: item.event!.id })
        }
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MyText style={[styles.emptyTitle, { color: textColor }]}>
        No Registered Events
      </MyText>
      <MyText style={[styles.emptyText, { color: textColor }]}>
        You haven&apos;t registered for any events yet.
      </MyText>
      <MyButton
        title="Browse Events"
        onPress={() => navigation.navigate("Events")}
        style={styles.browseButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View>
          <MyText style={[styles.greeting, { color: textColor }]}>
            Welcome back,
          </MyText>
          <MyText style={[styles.userName, { color: textColor }]}>
            {currentUser?.name}
          </MyText>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MyText style={styles.logoutText}>Logout</MyText>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <MyText style={[styles.sectionTitle, { color: textColor }]}>
          My Registered Events
        </MyText>
      </View>

      <FlatList
        data={registeredEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing(16),
    paddingTop: spacing(8),
  },
  greeting: {
    fontSize: fs(16),
    opacity: 0.7,
  },
  userName: {
    fontSize: fs(24),
    fontWeight: "bold",
    marginTop: spacing(4),
  },
  logoutButton: {
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(8),
    backgroundColor: "#FF3B30",
    borderRadius: responsive.radiusSm,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  sectionHeader: {
    paddingHorizontal: spacing(16),
    paddingBottom: spacing(8),
  },
  sectionTitle: {
    fontSize: fs(20),
    fontWeight: "bold",
  },
  listContent: {
    padding: spacing(16),
    paddingTop: spacing(8),
  },
  emptyContainer: {
    padding: spacing(40),
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: fs(20),
    fontWeight: "bold",
    marginBottom: spacing(8),
  },
  emptyText: {
    fontSize: fs(16),
    opacity: 0.6,
    textAlign: "center",
    marginBottom: spacing(24),
  },
  browseButton: {
    minWidth: spacing(200),
  },
});
