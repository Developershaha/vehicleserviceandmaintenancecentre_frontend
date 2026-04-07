import type { AutoSelectOption } from "./VehicleAutoSelectField";

export interface TitleOption {
  label: string;
  value: string;
}
export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  REJECTED: "Rejected",
  APPROVED: "Approved",
  INSPECTION: "Inspection",
  "IN PROGRESS": "In Progress",
  "QUALITY CHECK": "Quality Check",
  "READY FOR DELIVERY": "Ready for Delivery",
  DELIVERED: "Delivered",
};
export const TITLE_OPTIONS: TitleOption[] = [
  { label: "Mr", value: "MR" },
  { label: "Mrs", value: "MRS" },
  { label: "Ms", value: "MS" },
];

export interface VehilceType {
  label: string;
  value: string;
}
export const VEHICLE_TYPE: VehilceType[] = [{ label: "Car", value: "car" }];

export const VEHICLE_TYPE_OPTIONS: AutoSelectOption[] = [
  { label: "Car", value: "car" },
  { label: "Bike", value: "bike" },
];
