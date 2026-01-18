// store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  jwt: string | null;
  username: string | null;
  userId: string | null;
  role: string | null;
}

const initialState: AuthState = {
  jwt: null,
  username: null,
  userId: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setJwt: (state, action: PayloadAction<string>) => {
      state.jwt = action.payload;
    },

    setUserFromJwt: (
      state,
      action: PayloadAction<{
        username: string;
        userId: string;
        role: string;
      }>,
    ) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },

    logout: (state) => {
      state.jwt = null;
      state.username = null;
      state.userId = null;
      state.role = null;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setJwt, setUserFromJwt, logout } = authSlice.actions;
export default authSlice.reducer;
