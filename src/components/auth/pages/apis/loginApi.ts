import axiosInstance from "./axiosInstance";

export const loginApi = (payload: { username: string; password: string }) => {
  return axiosInstance.post("auth/login", payload);
};
