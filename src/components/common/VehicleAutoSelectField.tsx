import { useEffect, useRef, useState, useMemo } from "react";

export interface AutoSelectOption {
  id?: string | number;
  label: string;
  value: any;
}

export interface VehicleAutoSelectProps {
  label: string;
  name: string;
  value: AutoSelectOption | "" | null;
  options: AutoSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (value: AutoSelectOption | null) => void;
  onBlur?: () => void;
}

const VehicleAutoSelectField = ({
  label,
  name,
  value,
  options,
  placeholder = "Please select",
  required = false,
  disabled = false,
  clearable = true,
  error,
  touched,
  onChange,
  onBlur,
}: VehicleAutoSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = Boolean(error && touched);

  // Sync search term with selected value when dropdown is closed
  useEffect(() => {
    if (!open) {
      setSearchTerm(value ? value.label : "");
    }
  }, [value, open]);

  // Filter logic
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onBlur]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm("");
    onChange(null);
    inputRef.current?.focus();
  };

  return (
    <div ref={ref} className="relative mb-5 w-full group">
      <div
        className={`
          relative w-full h-12 rounded-lg border bg-white
          transition-all flex items-center
          ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "hover:border-gray-400"}
          ${showError ? "border-red-500 ring-4 ring-red-50" : "border-gray-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50"}
          ${open ? "border-blue-600 ring-4 ring-blue-50" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          className="w-full h-full bg-transparent px-4 pt-4 pb-1 text-sm outline-none"
          value={searchTerm}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!open) setOpen(true);
          }}
          placeholder={open ? placeholder : ""}
        />
      </div>

      {/* Floating Label Logic */}
      <label
        className={`
          absolute left-3 transition-all pointer-events-none px-1 bg-white
          ${searchTerm || open ? "-top-2 text-xs" : "top-3.5 text-sm text-gray-400"}
          ${showError ? "text-red-600" : open ? "text-blue-600" : "text-gray-500"}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Icons Section */}
      <div className="absolute right-3 top-3.5 flex items-center gap-1 text-gray-400">
        {clearable && searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="hover:text-red-500 p-0.5"
          >
            ✕
          </button>
        )}
        <span
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>

      {/* Dropdown Menu */}
      {open && !disabled && (
        <ul className="absolute z-[60] mt-2 w-full rounded-xl border border-gray-100 bg-white shadow-2xl max-h-52 overflow-auto py-2 animate-in fade-in zoom-in-95 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt);
                  setSearchTerm(opt.label);
                  setOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${value?.value === opt.value ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-sm text-gray-400 italic">
              No results found
            </li>
          )}
        </ul>
      )}

      {showError && (
        <p className="mt-1 ml-1 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default VehicleAutoSelectField;
