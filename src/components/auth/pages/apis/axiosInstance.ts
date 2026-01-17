import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import BASE_URL from "../../../constant";
import { logout, setJwt } from "../../../../store/authSlice";
import { showSnackbar } from "../../../../store/snackbarSlice";
import { store } from "../../../../store/store";

interface JwtPayload {
  exp: number;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  const jwt = store.getState().auth.jwt;
  if (!jwt) return config;

  const decoded: JwtPayload = jwtDecode(jwt);
  const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 5000;

  if (!isExpired) {
    config.headers.Authorization = `Bearer ${jwt}`;
    return config;
  }

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    store.dispatch(logout());
    window.location.replace("/login");
    return config;
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  isRefreshing = true;

  try {
    const res = await axios.post(`${BASE_URL}/user/refresh-token`, {
      refreshToken,
    });

    const newJwt = res.data.entity.Jwt;
    const newRefresh = res.data.entity.RefreshToken;

    store.dispatch(setJwt(newJwt));
    localStorage.setItem("refreshToken", newRefresh);

    processQueue(null, newJwt);

    config.headers.Authorization = `Bearer ${newJwt}`;
    return config;
  } catch (err) {
    processQueue(err, null);
    store.dispatch(logout());
    window.location.replace("/login");
    throw err;
  } finally {
    isRefreshing = false;
  }
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(
        showSnackbar({
          message: "Session expired. Please login again.",
          type: "warning",
        }),
      );
      store.dispatch(logout());
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
