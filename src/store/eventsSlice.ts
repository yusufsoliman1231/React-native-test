import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Event,
  FilterState,
  SortBy,
  SortDirection,
  LoadingState,
  ConflictPayload,
  UndoAction,
} from "@/types/index";

/**
 * Events state interface
 */
interface EventsState extends LoadingState {
  events: Event[];
  filteredEvents: Event[];
  filters: FilterState;
  conflicts: ConflictPayload[];
  pendingOperations: string[]; // Event IDs with pending operations
  undoActions: UndoAction[];
}

/**
 * Initial state
 */
const initialState: EventsState = {
  events: [],
  filteredEvents: [],
  filters: {
    searchQuery: "",
    sortBy: SortBy.DATE,
    sortDirection: SortDirection.ASC,
  },
  conflicts: [],
  pendingOperations: [],
  undoActions: [],
  isLoading: false,
  error: null,
};

/**
 * Helper function to filter and sort events
 */
const filterAndSortEvents = (
  events: Event[],
  filters: FilterState
): Event[] => {
  let filtered = [...events]; // Create a copy to avoid mutation

  // Apply search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.name.toLowerCase().includes(query) ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
    );
  }

  // Apply sorting - use slice to create a new sorted array
  filtered = filtered.slice().sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case SortBy.NAME:
        comparison = a.name.localeCompare(b.name);
        break;
      case SortBy.DATE:
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case SortBy.PRICE:
        comparison = a.price - b.price;
        break;
      case SortBy.LAST_UPDATED:
        comparison = (a.lastUpdated || 0) - (b.lastUpdated || 0);
        break;
    }

    return filters.sortDirection === SortDirection.ASC
      ? comparison
      : -comparison;
  });

  return filtered;
};

/**
 * Events slice
 */
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Set events from API
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
      state.filteredEvents = filterAndSortEvents(action.payload, state.filters);
      state.isLoading = false;
      state.error = null;
    },

    // Add single event
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      state.filteredEvents = filterAndSortEvents(state.events, state.filters);
    },

    // Update event
    updateEvent: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Event> }>
    ) => {
      const { id, changes } = action.payload;
      const eventIndex = state.events.findIndex((event) => event.id === id);

      if (eventIndex !== -1) {
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...changes,
          lastUpdated: Date.now(),
        };
        state.filteredEvents = filterAndSortEvents(state.events, state.filters);
      }
    },

    // Search and filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      state.filteredEvents = filterAndSortEvents(state.events, state.filters);
    },

    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.filters.sortBy = action.payload;
      state.filteredEvents = filterAndSortEvents(state.events, state.filters);
    },

    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.filters.sortDirection = action.payload;
      state.filteredEvents = filterAndSortEvents(state.events, state.filters);
    },

    // Optimistic update for event registration
    updateEventOptimistically: (
      state,
      action: PayloadAction<{
        eventId: string;
        changes: Partial<Event>;
        undoAction: UndoAction;
      }>
    ) => {
      const { eventId, changes, undoAction } = action.payload;
      const eventIndex = state.events.findIndex(
        (event) => event.id === eventId
      );

      if (eventIndex !== -1) {
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...changes,
          lastUpdated: Date.now(),
        };
        state.filteredEvents = filterAndSortEvents(state.events, state.filters);
        state.undoActions.push(undoAction);

        // Remove older undo actions (keep only last 5)
        if (state.undoActions.length > 5) {
          state.undoActions = state.undoActions.slice(-5);
        }
      }
    },

    // Undo last action
    undoLastAction: (state) => {
      const lastAction = state.undoActions.pop();
      if (lastAction) {
        const eventIndex = state.events.findIndex(
          (event) => event.id === lastAction.id
        );
        if (eventIndex !== -1) {
          // Revert the change based on action type
          if (lastAction.type === "REGISTRATION") {
            state.events[eventIndex].availableSpots =
              lastAction.previousValue.availableSpots;
            state.events[eventIndex].registeredCount =
              lastAction.previousValue.registeredCount;
          }
          state.filteredEvents = filterAndSortEvents(
            state.events,
            state.filters
          );
        }
      }
    },

    // Conflict resolution actions
    resolveConflict: (
      state,
      action: PayloadAction<{ conflictId: string; keepMine: boolean }>
    ) => {
      const { conflictId, keepMine } = action.payload;
      const conflictIndex = state.conflicts.findIndex(
        (c) => c.conflictId === conflictId
      );

      if (conflictIndex !== -1) {
        const conflict = state.conflicts[conflictIndex];
        const eventIndex = state.events.findIndex(
          (event) => event.id === conflict.clientEvent.id
        );

        if (eventIndex !== -1) {
          state.events[eventIndex] = keepMine
            ? conflict.clientEvent
            : conflict.serverEvent;
          state.filteredEvents = filterAndSortEvents(
            state.events,
            state.filters
          );
        }

        state.conflicts.splice(conflictIndex, 1);
      }
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Add pending operation
    addPendingOperation: (state, action: PayloadAction<string>) => {
      if (!state.pendingOperations.includes(action.payload)) {
        state.pendingOperations.push(action.payload);
      }
    },

    // Remove pending operation
    removePendingOperation: (state, action: PayloadAction<string>) => {
      state.pendingOperations = state.pendingOperations.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  setSearchQuery,
  setSortBy,
  setSortDirection,
  updateEventOptimistically,
  undoLastAction,
  resolveConflict,
  setLoading,
  setError,
  clearError,
  addPendingOperation,
  removePendingOperation,
} = eventsSlice.actions;

export default eventsSlice.reducer;
