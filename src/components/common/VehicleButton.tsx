interface VehicleButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
}

const alignMap = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const VehicleButton = ({
  text,
  type = "submit",
  onClick,
  disabled = false,
  align = "left",
  className = "",
}: VehicleButtonProps) => {
  return (
    <div className={`flex ${alignMap[align]}`}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          w-40 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white
          hover:bg-blue-700 transition
          disabled:cursor-not-allowed disabled:opacity-60
          ${className}
        `}
      >
        {text}
      </button>
    </div>
  );
};

export default VehicleButton;
