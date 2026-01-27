export type VehicleType = "car" | "bike";

export interface AddVehicleFormValues {
  vehVehicleNumber: string;
  vehVehicleType: VehicleType | ""; // empty initially
  vehBrand: string;
  vehModel: string;
  vehManufacturingYear: string; // string because input field
}
