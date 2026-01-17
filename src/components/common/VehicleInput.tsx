interface VehicleInputProps {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

const VehicleInput = ({
  label,
  type = "text",
  required = false,
  placeholder,
}: VehicleInputProps) => {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
      />
    </div>
  );
};

export default VehicleInput;
