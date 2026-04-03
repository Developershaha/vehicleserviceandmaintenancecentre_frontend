import React from "react";

interface VehicleInputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  touched?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  startIcon?: React.ReactNode; // New: Left side icon
  endIcon?: React.ReactNode; // Right side icon (e.g., Eye icon)
  onEndIconClick?: () => void;
}

const VehicleInput = ({
  label,
  name,
  value,
  type = "text",
  required = false,
  error,
  touched,
  disabled = false,
  placeholder = " ", // Space allows the peer-placeholder-shown trick
  onChange,
  onBlur,
  startIcon,
  endIcon,
  onEndIconClick,
}: VehicleInputProps) => {
  const showError = Boolean(error && touched);

  return (
    <div className="relative mb-5 group">
      {/* Container for Input + Icons */}
      <div className="relative flex items-center">
        {/* 🛠 Start Icon (Left) */}
        {startIcon && (
          <div
            className={`absolute left-4 z-20 transition-colors duration-200 ${
              showError
                ? "text-red-400"
                : "text-gray-400 group-focus-within:text-blue-500"
            }`}
          >
            {startIcon}
          </div>
        )}

        <input
          id={name}
          name={name}
          value={value}
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            peer w-full h-14 rounded-xl border-2 px-4 outline-none transition-all
            text-gray-700 font-medium
            ${startIcon ? "pl-12" : "pl-4"} 
            ${endIcon ? "pr-12" : "pr-4"}
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "bg-white"}
            ${
              showError
                ? "border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            }
            pt-4 pb-1 // Adds space for the floating label above the text
          `}
        />

        {/* 🏷 Floating Label */}
        <label
          htmlFor={name}
          className={`
            absolute z-10 transition-all duration-200 pointer-events-none
            /* If there's a start icon, push label right, otherwise keep it left */
            ${startIcon ? "left-12" : "left-4"} 
            
            /* Logic: When input is focused OR has value, shrink and move up */
            peer-placeholder-shown:top-4 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-400
            
            peer-focus:top-2 
            peer-focus:text-xs 
            peer-focus:font-bold
            
            /* State when NOT focused but has value (persists the float) */
            ${value ? "top-2 text-xs font-bold" : ""}

            /* Color logic */
            ${showError ? "text-red-500" : "text-gray-500 peer-focus:text-blue-600"}
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* 👁 End Icon (Right) */}
        {endIcon && (
          <button
            type="button"
            onClick={onEndIconClick}
            className="absolute right-4 z-20 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {endIcon}
          </button>
        )}
      </div>

      {/* ⚠️ Error Message */}
      {showError && (
        <div className="flex items-center gap-1 mt-1.5 ml-1">
          <svg
            className="w-3.5 h-3.5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs font-medium text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default VehicleInput;
