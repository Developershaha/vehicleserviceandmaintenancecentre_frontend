import type { VehilceType } from "../../common/common";

export interface AddVehicleFormValues {
  vehVehicleNumber: string;
  vehVehicleType: VehilceType | ""; // empty initially
  vehBrand: string;
  vehModel: string;
  vehManufacturingYear: string; // string because input field
}
