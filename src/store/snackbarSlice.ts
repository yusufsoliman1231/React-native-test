import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnackbarMessage } from "@/types/index";

interface SnackbarState {
  messages: SnackbarMessage[];
}

const initialState: SnackbarState = {
  messages: [],
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showMessage: (
      state,
      action: PayloadAction<Omit<SnackbarMessage, "id">>
    ) => {
      const { scope = "global", ...rest } = action.payload;
      const message: SnackbarMessage = {
        ...rest,
        scope,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.messages.push(message);
    },

    hideMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },

    clearAllMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { showMessage, hideMessage, clearAllMessages } =
  snackbarSlice.actions;
export default snackbarSlice.reducer;
