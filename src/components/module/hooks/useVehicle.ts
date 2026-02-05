import axiosInstance from "../../auth/pages/apis/axiosInstance";
import type { AutoSelectOption } from "../../common/VehicleAutoSelectField";
import axios from "axios";
import BASE_URL from "../../constant";

export interface AddVehiclePayload {
  vehVehicleNumber: string;
  vehVehicleType: AutoSelectOption | null; // ✅ object
  vehBrand: string;
  vehModel: string;
  vehManufacturingYear: number;
}

export const addVehicleApi = (payload: AddVehiclePayload) => {
  return axiosInstance.post("customer/vehicles", payload);
};

export const deleteVehicleApi = (vehId: number) => {
  return axiosInstance.delete("/vehicle", {
    params: { vehId },
  });
};

export const checkUsernameDuplicateApi = (username: string) => {
  return axios.get(`${BASE_URL}auth/user/duplicate-check`, {
    params: { username },
  });
};
