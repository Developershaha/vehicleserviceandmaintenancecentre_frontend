import type { AutoSelectOption } from "../../common/VehicleAutoSelectField";

export interface AddVehicleFormValues {
  vehVehicleNumber: string;
  vehVehicleType: AutoSelectOption | null; // ✅ object
  vehBrand: string;
  vehModel: string;
  vehManufacturingYear: string; // string because input field
}
