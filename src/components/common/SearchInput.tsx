interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border rounded-xl shadow-sm
                   focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      {/* Search Icon */}
      <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
