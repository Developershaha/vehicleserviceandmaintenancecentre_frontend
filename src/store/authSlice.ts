// store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  jwt: string | null;
}

const initialState: AuthState = {
  jwt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setJwt: (state, action: PayloadAction<string>) => {
      state.jwt = action.payload;
    },
    logout: (state) => {
      state.jwt = null;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setJwt, logout } = authSlice.actions;
export default authSlice.reducer;
