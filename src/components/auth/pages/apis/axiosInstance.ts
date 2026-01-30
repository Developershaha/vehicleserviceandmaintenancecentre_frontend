import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import BASE_URL from "../../../constant";
import { store } from "../../../../store/store";
import { logout, setAuthTokens } from "../../../../store/authSlice";
import { showSnackbar } from "../../../../store/snackbarSlice";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const { jwt, refreshToken } = store.getState().auth;

  if (!jwt) return config;

  const decoded: any = jwtDecode(jwt);
  const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 5000;

  // ✅ Token valid
  if (!isExpired) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${jwt}`,
    };
    return config;
  }

  // ❌ No refresh token → logout
  if (!refreshToken) {
    store.dispatch(logout());
    window.location.replace("/cellmaUser/login");
    return Promise.reject("Session expired");
  }

  // 🔁 Refresh token flow
  try {
    const response = await axios.get(
      `${BASE_URL.replace(/\/+$/, "")}/user/refresh-token`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          refreshToken,
        },
      },
    );

    const { jwtToken, refreshToken: newRefreshToken } = response.data;

    store.dispatch(
      setAuthTokens({
        jwt: jwtToken,
        refreshToken: newRefreshToken,
      }),
    );

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${jwtToken}`,
    };

    return config;
  } catch (error) {
    store.dispatch(logout());
    window.location.replace("/cellmaUser/login");
    return Promise.reject(error);
  }
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
      window.location.replace("/");
    }

    if (error.message === "Network Error") {
      store.dispatch(
        showSnackbar({
          message: "Network error. Please try again.",
          type: "warning",
        }),
      );
    }

    return Promise.reject(error);
  },
);
export default axiosInstance;
