import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

/**
 * Base selectors
 */
export const selectEventsState = (state: RootState) => state.events;
export const selectAllEvents = (state: RootState) => state.events.events;
export const selectFilteredEvents = (state: RootState) =>
  state.events.filteredEvents;
export const selectEventsFilters = (state: RootState) => state.events.filters;
export const selectEventsLoading = (state: RootState) => state.events.isLoading;
export const selectEventsError = (state: RootState) => state.events.error;
export const selectConflicts = (state: RootState) => state.events.conflicts;
export const selectPendingOperations = (state: RootState) =>
  state.events.pendingOperations;
export const selectUndoActions = (state: RootState) => state.events.undoActions;

/**
 * Get event by ID
 */
export const selectEventById = (eventId: string) =>
  createSelector([selectAllEvents], (events) =>
    events.find((event) => event.id === eventId)
  );

/**
 * Get upcoming events
 */
export const selectUpcomingEvents = createSelector(
  [selectFilteredEvents],
  (events) => {
    const now = new Date().getTime();
    return events.filter((event) => new Date(event.date).getTime() >= now);
  }
);

/**
 * Get past events
 */
export const selectPastEvents = createSelector(
  [selectFilteredEvents],
  (events) => {
    const now = new Date().getTime();
    return events.filter((event) => new Date(event.date).getTime() < now);
  }
);

/**
 * Get free events
 */
export const selectFreeEvents = createSelector(
  [selectFilteredEvents],
  (events) => events.filter((event) => event.price === 0 || event.isFree)
);

/**
 * Get paid events
 */
export const selectPaidEvents = createSelector(
  [selectFilteredEvents],
  (events) => events.filter((event) => event.price > 0 && !event.isFree)
);

/**
 * Get events with available spots
 */
export const selectAvailableEvents = createSelector(
  [selectFilteredEvents],
  (events) => events.filter((event) => event.availableSpots > 0)
);

/**
 * Get full events
 */
export const selectFullEvents = createSelector(
  [selectFilteredEvents],
  (events) => events.filter((event) => event.availableSpots === 0)
);

/**
 * Check if event has pending operation
 */
export const selectEventHasPendingOperation = (eventId: string) =>
  createSelector([selectPendingOperations], (pendingOps) =>
    pendingOps.includes(eventId)
  );

/**
 * Get search query
 */
export const selectSearchQuery = createSelector(
  [selectEventsFilters],
  (filters) => filters.searchQuery
);

/**
 * Get sort settings
 */
export const selectSortSettings = createSelector(
  [selectEventsFilters],
  (filters) => ({
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  })
);

/**
 * Check if there are any conflicts
 */
export const selectHasConflicts = createSelector(
  [selectConflicts],
  (conflicts) => conflicts.length > 0
);

/**
 * Check if undo is available
 */
export const selectCanUndo = createSelector(
  [selectUndoActions],
  (undoActions) => undoActions.length > 0
);

/**
 * Get events count
 */
export const selectEventsCount = createSelector(
  [selectFilteredEvents],
  (events) => events.length
);

/**
 * Get total capacity across all events
 */
export const selectTotalCapacity = createSelector([selectAllEvents], (events) =>
  events.reduce((total, event) => total + event.capacity, 0)
);

/**
 * Get total available spots
 */
export const selectTotalAvailableSpots = createSelector(
  [selectAllEvents],
  (events) => events.reduce((total, event) => total + event.availableSpots, 0)
);
