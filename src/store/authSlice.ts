import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  jwt: string | null;
  refreshToken: string | null;
  username: string | null;
  userId: string | null;
  role: string | null;
  userType: string | null;
}

const initialState: AuthState = {
  jwt: null,
  refreshToken: null,
  username: null,
  userId: null,
  role: null,
  userType: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{
        jwt: string;
        refreshToken: string;
      }>,
    ) => {
      state.jwt = action.payload.jwt;
      state.refreshToken = action.payload.refreshToken;
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
    setUserType: (
      state,
      action: PayloadAction<{
        userType: string;
      }>,
    ) => {
      state.userType = action.payload.userType;
    },

    logout: (state) => {
      state.jwt = null;
      state.refreshToken = null;
      state.username = null;
      state.userId = null;
      state.role = null;
    },
  },
});

export const { setAuthTokens, setUserFromJwt, logout, setUserType } =
  authSlice.actions;
export default authSlice.reducer;
