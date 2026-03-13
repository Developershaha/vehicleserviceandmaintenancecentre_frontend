import React from "react";

interface VehicleTextareaProps {
  label: string;
  name: string;
  value: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean; // 1. Added to interface
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
  disabled = false, // 2. Default to false
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
        disabled={disabled} // 3. Pass to native textarea
        className={`
          peer w-full resize-none rounded-md border px-4 pt-6 pb-3
          text-sm outline-none transition-all
          ${
            disabled
              ? "cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200" // Disabled styles
              : showError
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
          ${hasValue ? "-top-2 scale-90" : "top-4"}
          ${disabled ? "text-gray-400" : "text-gray-500"} 
          peer-focus:-top-2
          peer-focus:scale-90
          ${!disabled && !showError ? "peer-focus:text-blue-600" : ""}
          ${showError ? "text-red-600 peer-focus:text-red-600" : ""}
          ${hasValue && !disabled && !showError ? "text-blue-600" : ""}
        `}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {showError && !disabled && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default VehicleTextarea;
