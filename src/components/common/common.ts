export type TitleValue = "MR" | "MRS" | "MS" | "DR";

export interface TitleOption {
  label: string;
  value: TitleValue;
}

export const TITLE_OPTIONS: TitleOption[] = [
  { label: "Mr", value: "MR" },
  { label: "Mrs", value: "MRS" },
  { label: "Ms", value: "MS" },
];
