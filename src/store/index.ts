import { configureStore } from "@reduxjs/toolkit";
import * as apiModule from "../services/api";
import eventsReducer from "./eventsSlice";
import snackbarReducer from "./snackbarSlice";

const api: any = (apiModule && (apiModule as any).api) || {
  reducerPath: "api",
  reducer: (state = {}) => state,
  middleware: () => (next: any) => (action: any) => next(action),
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    events: eventsReducer,
    snackbar: snackbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["snackbar/showMessage"],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["payload.action.onPress"],
        // Ignore these paths in the state
        ignoredPaths: ["snackbar.messages.action.onPress"],
      },
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
