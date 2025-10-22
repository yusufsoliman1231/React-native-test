import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetEventsQuery } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setEvents,
  setSearchQuery,
  setSortBy,
  setSortDirection,
} from "../../store/eventsSlice";
import {
  selectFilteredEvents,
  selectSearchQuery,
  selectSortSettings,
} from "../../store/eventsSelectors";
import { MyText } from "../../components/ui/MyText";
import { MyButton } from "../../components/ui/MyButton";
import { EventCard } from "../../components/EventCard";
import { useThemeColor } from "../../hooks/useThemeColor";
import { useDebounce } from "../../hooks/useDebounce";
import type { Event } from "../../types/index";
import { SortBy, SortDirection } from "../../types/index";
import { responsive, spacing, fs } from "../../constants/Responsive";

export function EventListScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { data: events, isLoading, error, refetch } = useGetEventsQuery();

  const filteredEvents = useSelector(selectFilteredEvents);
  const searchQuery = useSelector(selectSearchQuery);
  const { sortBy, sortDirection } = useSelector(selectSortSettings);

  // Local state for immediate UI updates
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounced value for Redux dispatch
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    if (events) {
      dispatch(setEvents(events));
    }
  }, [events, dispatch]);

  // Dispatch debounced search query to Redux
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
  };

  const toggleSortDirection = () => {
    dispatch(
      setSortDirection(
        sortDirection === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC
      )
    );
  };

  const changeSortBy = (newSortBy: SortBy) => {
    dispatch(setSortBy(newSortBy));
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      variant="fullcard"
      onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <MyText style={[styles.emptyText, { color: textColor }]}>
        {isLoading ? "Loading events..." : "No events found"}
      </MyText>
      {searchQuery && (
        <MyText style={styles.emptySubtext}>Try adjusting your search</MyText>
      )}
    </View>
  );

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
          <MyText style={styles.errorText}>Failed to load events</MyText>
          <MyButton
            title="Retry"
            onPress={() => refetch()}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <MyText style={[styles.headerTitle, { color: textColor }]}>
          Events
        </MyText>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: "#f5f5f5" }]}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={localSearchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {localSearchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Controls */}
        <View style={styles.sortContainer}>
          <MyText style={[styles.sortLabel, { color: textColor }]}>
            Sort by:
          </MyText>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === SortBy.DATE && styles.sortButtonActive,
              { borderColor: tintColor },
            ]}
            onPress={() => changeSortBy(SortBy.DATE)}>
            <MyText
              style={[
                styles.sortButtonText,
                sortBy === SortBy.DATE && { color: tintColor },
              ]}>
              Date
            </MyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === SortBy.NAME && styles.sortButtonActive,
              { borderColor: tintColor },
            ]}
            onPress={() => changeSortBy(SortBy.NAME)}>
            <MyText
              style={[
                styles.sortButtonText,
                sortBy === SortBy.NAME && { color: tintColor },
              ]}>
              Name
            </MyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === SortBy.PRICE && styles.sortButtonActive,
              { borderColor: tintColor },
            ]}
            onPress={() => changeSortBy(SortBy.PRICE)}>
            <MyText
              style={[
                styles.sortButtonText,
                sortBy === SortBy.PRICE && { color: tintColor },
              ]}>
              Price
            </MyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortDirectionButton}
            onPress={toggleSortDirection}>
            <Ionicons
              name={
                sortDirection === SortDirection.ASC
                  ? "arrow-up-outline"
                  : "arrow-down-outline"
              }
              size={20}
              color={tintColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredEvents}
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
    padding: spacing(16),
    paddingTop: spacing(8),
  },
  headerTitle: {
    fontSize: fs(28),
    fontWeight: "bold",
    marginBottom: spacing(16),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(10),
    borderRadius: responsive.radiusMd,
    marginBottom: spacing(12),
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing(8),
    fontSize: fs(16),
    color: "#000",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(8),
    marginTop: spacing(8),
  },
  sortLabel: {
    fontSize: fs(14),
    fontWeight: "600",
    marginRight: spacing(4),
  },
  sortButton: {
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(6),
    borderRadius: spacing(16),
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sortButtonActive: {
    backgroundColor: "#f0f8ff",
  },
  sortButtonText: {
    fontSize: fs(13),
    color: "#666",
  },
  sortDirectionButton: {
    padding: spacing(6),
    marginLeft: spacing(4),
  },
  listContent: {
    padding: spacing(16),
    paddingTop: spacing(8),
  },
  emptyContainer: {
    padding: spacing(40),
    alignItems: "center",
  },
  emptyText: {
    fontSize: fs(16),
    opacity: 0.6,
    marginTop: spacing(16),
  },
  emptySubtext: {
    fontSize: fs(14),
    opacity: 0.5,
    marginTop: spacing(8),
  },
  errorText: {
    fontSize: fs(16),
    color: "#ff4444",
    marginTop: spacing(16),
    marginBottom: spacing(24),
  },
  retryButton: {
    minWidth: spacing(120),
  },
});
