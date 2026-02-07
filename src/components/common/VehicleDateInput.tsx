import React from "react";

interface VehicleDateInputProps {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/* 🔹 helper to format dd/mm/yyyy */
const formatDateInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
};

/* 🔹 convert yyyy-mm-dd → dd/mm/yyyy */
const fromISO = (value: string) => {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
};

const VehicleDateInput = ({
  label,
  name,
  value,
  required = false,
  error,
  touched,
  onChange,
  onBlur,
}: VehicleDateInputProps) => {
  const showError = Boolean(error && touched);
  const hasValue = Boolean(value);

  return (
    <div className="relative mb-6">
      {/* TEXT INPUT */}
      <input
        type="text"
        name={name}
        value={value}
        placeholder="dd/mm/yyyy"
        onChange={(e) => onChange(formatDateInput(e.target.value))}
        onBlur={onBlur}
        className={`
          peer w-full h-12 rounded-md border px-4 pt-5 pb-3 text-sm outline-none
          ${
            showError
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          }
        `}
      />

      {/* CALENDAR PICKER (overlayed icon input) */}
      <input
        type="date"
        className="absolute right-3 top-3 h-6 w-6 opacity-0 cursor-pointer"
        onChange={(e) => onChange(fromISO(e.target.value))}
      />

      {/* Floating Label */}
      <label
        className={`
          absolute left-3 z-10 bg-white px-1 text-sm transition-all
          ${hasValue ? "-top-2 scale-90 text-blue-600" : "top-4 text-gray-500"}
          peer-focus:-top-2 peer-focus:scale-90 peer-focus:text-blue-600
          ${showError ? "text-red-600 peer-focus:text-red-600" : ""}
        `}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {/* Error */}
      {showError && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default VehicleDateInput;
