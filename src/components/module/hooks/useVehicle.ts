import axiosInstance from "../../auth/pages/apis/axiosInstance";

export interface AddVehiclePayload {
  vehVehicleNumber: string;
  vehVehicleType: "car" | "bike";
  vehBrand: string;
  vehModel: string;
  vehManufacturingYear: number;
}

export const addVehicleApi = (payload: AddVehiclePayload) => {
  return axiosInstance.post("customer/vehicles", payload);
};
