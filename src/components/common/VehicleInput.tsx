interface VehicleInputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const VehicleInput = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
  error,
  touched,
  onChange,
  onBlur,
}: VehicleInputProps) => {
  const showError = Boolean(error && touched);

  return (
    <div className="mb-4">
      <label
        className={`mb-1 block text-sm font-medium ${
          showError ? "text-red-600" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full rounded-md border px-4 py-2 text-sm outline-none
          ${
            showError
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          }
        `}
      />

      {showError && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default VehicleInput;
