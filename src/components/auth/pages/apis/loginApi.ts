import BASE_URL from "../../../constant";
import axiosInstance from "./axiosInstance";
import axios from "axios";
export const loginApi = (payload: { username: string; password: string }) => {
  return axiosInstance.post("auth/login", payload);
};

export const logoutApi = (username: string) => {
  return axiosInstance.delete("auth/logout", {
    params: {
      username,
    },
  });
};

export interface RegisterApiPayload {
  useUsername: string;
  useTitle: string;
  useFirstName: string;
  useSurname: string;
  useEmail: string;
  useMobile: string;
  usePassword: string;
}

export const registerApi = (payload: RegisterApiPayload) => {
  return axios.post(`${BASE_URL}auth/register`, payload);
};
