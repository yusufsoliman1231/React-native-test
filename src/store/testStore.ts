import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";
import snackbarReducer from "./snackbarSlice";

export function createTestStore(preloadedState = {}) {
  const api = {
    reducerPath: "api",
    reducer: (s = {}) => s,
    middleware: () => (next: any) => (action: any) => next(action),
  };

  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      events: eventsReducer,
      snackbar: snackbarReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  });
}

export type TestStore = ReturnType<typeof createTestStore>;
