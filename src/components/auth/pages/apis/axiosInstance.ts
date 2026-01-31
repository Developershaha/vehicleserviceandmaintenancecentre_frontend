import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import dayjs from "dayjs";
import BASE_URL from "../../../constant";
import { store } from "../../../../store/store";
import { logout, setAuthTokens } from "../../../../store/authSlice";
import { showSnackbar } from "../../../../store/snackbarSlice";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

/* ---------------------------------------------------- */
/* -------------------- HELPERS ----------------------- */
/* ---------------------------------------------------- */

const cookies = new Cookies();
let isRefreshing = false;

type QueuedRequest = {
  resolve: (value: InternalAxiosRequestConfig) => void;
  reject: (error: any) => void;
  config: InternalAxiosRequestConfig;
};

const requestQueue: QueuedRequest[] = [];

/* ---------------------------------------------------- */
/* ---------------- AXIOS INSTANCE -------------------- */
/* ---------------------------------------------------- */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

/* ---------------------------------------------------- */
/* -------------- REQUEST INTERCEPTOR ---------------- */
/* ---------------------------------------------------- */

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { jwt } = store.getState().auth;

    /* ---------- No JWT ---------- */
    if (!jwt) return config;

    const tokenDetails: any = jwtDecode(jwt);
    const isExpired = dayjs.unix(tokenDetails.exp).diff(dayjs()) < 5000;

    /* ---------- JWT valid ---------- */
    if (!isExpired) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${jwt}`,
      };
      return config;
    }

    /* ---------- Refresh token from cookies ---------- */
    const refreshToken = cookies.get("refreshToken");

    if (!refreshToken) {
      store.dispatch(logout());
      globalThis.location.replace("/cellmaUser/login");
      return Promise.reject("No refresh token");
    }

    const refreshDetails: any = jwtDecode(refreshToken);
    const isRefreshExpired =
      dayjs.unix(refreshDetails.exp).diff(dayjs()) < 5000;

    if (isRefreshExpired) {
      cookies.remove("jwt", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });
      store.dispatch(logout());
      globalThis.location.replace("/cellmaUser/login");
      return Promise.reject("Refresh token expired");
    }

    /* ---------- QUEUE ---------- */
    if (isRefreshing) {
      return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
        requestQueue.push({ resolve, reject, config });
      });
    }

    /* ---------- REFRESH ---------- */
    isRefreshing = true;

    try {
      const response = await axios.get(
        `${BASE_URL.replace(/\/+$/, "")}/auth/refresh-token`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            refreshToken,
          },
        },
      );

      const refreshEntity = response.data?.entity?.refreshToken;

      if (!refreshEntity?.jwtToken || !refreshEntity?.refreshToken) {
        throw new Error("Invalid refresh response");
      }

      const jwtToken = refreshEntity.jwtToken;
      const newRefreshToken = refreshEntity.refreshToken;

      /* update cookies */
      cookies.set("jwt", jwtToken, {
        path: "/",
        sameSite: "strict",
        secure: true,
      });
      cookies.set("refreshToken", newRefreshToken, {
        path: "/",
        sameSite: "strict",
        secure: true,
      });

      /* update redux */
      store.dispatch(
        setAuthTokens({
          jwt: jwtToken,
          refreshToken: newRefreshToken,
        }),
      );

      /* update headers */
      config.headers.Authorization = `Bearer ${jwtToken}`;

      /* ---------- Resolve queued requests ---------- */
      requestQueue.forEach(({ resolve, config }) => {
        resolve({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      });

      requestQueue.length = 0;

      /* ---------- Continue current request ---------- */
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${jwtToken}`,
        },
      };
    } catch (error) {
      requestQueue.forEach(({ reject }) => reject(error));
      requestQueue.length = 0;
      store.dispatch(logout());
      globalThis.location.replace("/cellmaUser/login");
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
  (error) => Promise.reject(error),
);

/* ---------------------------------------------------- */
/* -------------- RESPONSE INTERCEPTOR ---------------- */
/* ---------------------------------------------------- */

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
      globalThis.location.replace("/");
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
