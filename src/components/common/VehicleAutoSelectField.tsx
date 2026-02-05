import { useEffect, useRef, useState, useMemo } from "react";

export interface AutoSelectOption {
  id?: string | number;
  label: string;
  value: any;
}

export interface VehicleAutoSelectProps {
  label: string;
  name: string;
  value: AutoSelectOption | null;
  options: AutoSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (value: AutoSelectOption | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // ✅ FIXED
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = Boolean(error && touched);

  // Sync input text when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchTerm(value ? value.label : "");
    }
  }, [value, open]);

  // Filter options
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm("");
    onChange(null);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative mb-5 w-full">
      {/* Input Wrapper */}
      <div
        className={`
          relative flex h-12 items-center rounded-lg border bg-white transition-all
          ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "hover:border-gray-400"}
          ${
            showError
              ? "border-red-500 ring-4 ring-red-50"
              : "border-gray-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50"
          }
          ${open ? "border-blue-600 ring-4 ring-blue-50" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          name={name} // ✅ REQUIRED for Formik
          value={searchTerm}
          disabled={disabled}
          className="h-full w-full bg-transparent px-4 pt-4 pb-1 text-sm outline-none"
          placeholder={open ? placeholder : ""}
          onFocus={() => setOpen(true)}
          onBlur={onBlur} // ✅ Formik handleBlur
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!open) setOpen(true);
          }}
        />

        {/* Icons */}
        <div className="absolute right-3 top-3.5 flex items-center gap-1 text-gray-400">
          {clearable && searchTerm && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:text-red-500"
            >
              ✕
            </button>
          )}
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
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
        </div>
      </div>

      {/* Floating Label */}
      <label
        className={`
          absolute left-3 px-1 bg-white pointer-events-none transition-all
          ${searchTerm || open ? "-top-2 text-xs" : "top-3.5 text-sm text-gray-400"}
          ${showError ? "text-red-600" : open ? "text-blue-600" : "text-gray-500"}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Dropdown */}
      {open && !disabled && (
        <ul className="absolute z-[60] mt-2 max-h-52 w-full overflow-auto rounded-xl border border-gray-100 bg-white py-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt);
                  setSearchTerm(opt.label);
                  setOpen(false);
                }}
                className={`
                  cursor-pointer px-4 py-2.5 text-sm transition-colors
                  ${
                    value?.value === opt.value
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-sm italic text-gray-400">
              No results found
            </li>
          )}
        </ul>
      )}

      {/* Error */}
      {showError && (
        <p className="mt-1 ml-1 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default VehicleAutoSelectField;
