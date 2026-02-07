import { useRef } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface VehicleDateInputProps {
  label: string;
  name: string;
  value: string; // dd/mm/yyyy
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

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
  const dateRef = useRef<HTMLInputElement>(null);
  const showError = Boolean(error && touched);

  /* ---------- helpers ---------- */

  const todayISO = new Date().toISOString().split("T")[0];

  const toISO = (v: string) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return "";
    const [d, m, y] = v.split("/");
    return `${y}-${m}-${d}`;
  };

  const fromISO = (v: string) => {
    const [y, m, d] = v.split("-");
    return `${d}/${m}/${y}`;
  };

  /* ---------- typing handler ---------- */
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^\d]/g, "");

    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);

    onChange(v);
  };

  return (
    <div className="relative mb-6">
      <div
        className={`relative flex items-center rounded-md border bg-white
        ${
          showError
            ? "border-red-500 ring-2 ring-red-100"
            : "border-gray-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100"
        }`}
      >
        {/* TEXT INPUT (typing allowed) */}
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleTyping}
          onBlur={onBlur}
          className="peer w-full rounded-md bg-transparent px-4 pt-5 pb-2 text-sm outline-none"
        />

        <input
          ref={dateRef}
          type="date"
          min={todayISO}
          value={toISO(value)}
          onChange={(e) => onChange(fromISO(e.target.value))}
          className="absolute inset-0 opacity-0 pointer-events-none"
        />

        {/* CALENDAR ICON */}
        <button
          type="button"
          onClick={() => dateRef.current?.showPicker()}
          className="absolute right-3 top-3.5 rounded-md p-1.5
                     text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <CalendarDaysIcon className="h-5 w-5" />
        </button>

        {/* FLOATING LABEL */}
        <label
          className={`absolute left-3 bg-white px-1 text-sm transition-all
          ${value ? "-top-2 scale-90 text-blue-600" : "top-3.5 text-gray-400"}
          peer-focus:-top-2 peer-focus:scale-90 peer-focus:text-blue-600
          ${showError ? "text-red-600" : ""}`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      </div>

      {showError && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default VehicleDateInput;
