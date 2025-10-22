import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

/**
 * Base selectors
 */
export const selectSnackbarState = (state: RootState) => state.snackbar;

/**
 * Memoized selector for global scope messages
 */
export const selectGlobalMessages = createSelector(
  [selectSnackbarState],
  (snackbar) => {
    if (!snackbar || !snackbar.messages) return [];
    return snackbar.messages.filter((message) => message.scope !== "modal");
  }
);

/**
 * Memoized selector for modal scope messages
 */
export const selectModalMessages = createSelector(
  [selectSnackbarState],
  (snackbar) => {
    if (!snackbar || !snackbar.messages) return [];
    return snackbar.messages.filter(
      (message) => message.scope === "modal" || message.scope === "both"
    );
  }
);

/**
 * Get all messages
 */
export const selectAllMessages = createSelector(
  [selectSnackbarState],
  (snackbar) => snackbar?.messages || []
);

/**
 * Check if there are any messages
 */
export const selectHasMessages = createSelector(
  [selectAllMessages],
  (messages) => messages.length > 0
);
