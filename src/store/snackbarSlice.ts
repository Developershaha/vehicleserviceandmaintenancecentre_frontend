import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SnackbarType = "success" | "error" | "warning" | "info";
export type SnackbarVertical = "top" | "bottom";
export type SnackbarHorizontal = "left" | "center" | "right";

export interface SnackbarState {
  snackbarOpen: boolean;
  snackbarType: SnackbarType;
  snackbarMessage: string;
  snackbarAutoHideDuration: number; // seconds
  snackbarVertical: SnackbarVertical;
  snackbarHorizontal: SnackbarHorizontal;
}

const initialState: SnackbarState = {
  snackbarOpen: false,
  snackbarType: "info",
  snackbarMessage: "",
  snackbarAutoHideDuration: 3,
  snackbarVertical: "top",
  snackbarHorizontal: "right",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        type?: SnackbarType;
        duration?: number;
        vertical?: SnackbarVertical;
        horizontal?: SnackbarHorizontal;
      }>
    ) => {
      state.snackbarOpen = true;
      state.snackbarMessage = action.payload.message;
      state.snackbarType = action.payload.type ?? "info";
      state.snackbarAutoHideDuration = action.payload.duration ?? 3;
      state.snackbarVertical = action.payload.vertical ?? "top";
      state.snackbarHorizontal = action.payload.horizontal ?? "right";
    },

    hideSnackbar: (state) => {
      state.snackbarOpen = false;
      state.snackbarMessage = "";
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
