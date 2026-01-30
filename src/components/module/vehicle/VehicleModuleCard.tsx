import { useNavigate } from "react-router-dom";

const VehicleModuleCard = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/vehicles")}
      className="cursor-pointer w-1/6 rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Square Image */}
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-blue-100 text-4xl">
          🚗
        </div>

        {/* Name Below Image */}
        <h3 className="text-center text-lg font-semibold text-gray-800">
          Vehicle Module
        </h3>
      </div>
    </div>
  );
};

export default VehicleModuleCard;
