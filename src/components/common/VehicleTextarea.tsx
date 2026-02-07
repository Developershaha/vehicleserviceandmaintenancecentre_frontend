import React from "react";

interface VehicleTextareaProps {
  label: string;
  name: string;
  value: string;
  rows?: number;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const VehicleTextarea = ({
  label,
  name,
  value,
  rows = 4,
  required = false,
  error,
  touched,
  onChange,
  onBlur,
}: VehicleTextareaProps) => {
  const showError = Boolean(error && touched);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative mb-6">
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          peer w-full resize-none rounded-md border px-4 pt-6 pb-3
          text-sm outline-none
          ${
            showError
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          }
        `}
      />

      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`
          absolute left-3 z-10 bg-white px-1 text-sm transition-all
          ${hasValue ? "-top-2 scale-90 text-blue-600" : "top-4 text-gray-500"}
          peer-focus:-top-2
          peer-focus:scale-90
          peer-focus:text-blue-600
          ${showError ? "text-red-600 peer-focus:text-red-600" : ""}
        `}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {showError && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default VehicleTextarea;
