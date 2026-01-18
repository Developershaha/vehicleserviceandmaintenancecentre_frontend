interface VehicleInputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;

  endIcon?: React.ReactNode;
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
  onChange,
  onBlur,
  endIcon,
  onEndIconClick,
}: VehicleInputProps) => {
  const showError = Boolean(error && touched);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative mb-6">
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          peer w-full h-12 rounded-md border px-4 pt-5 pb-3
          text-sm outline-none
          ${endIcon ? "pr-10" : ""}
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

      {/* 👁 End Icon */}
      {endIcon && (
        <button
          type="button"
          onClick={onEndIconClick}
          className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
        >
          {endIcon}
        </button>
      )}

      {showError && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default VehicleInput;
