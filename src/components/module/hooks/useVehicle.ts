import axiosInstance from "../../auth/pages/apis/axiosInstance";
import type { AutoSelectOption } from "../../common/VehicleAutoSelectField";

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
