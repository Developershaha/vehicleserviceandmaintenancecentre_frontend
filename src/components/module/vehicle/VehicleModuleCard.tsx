import { useNavigate } from "react-router-dom";

const VehicleModuleCard = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/vehicles")}
      className="cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          🚗
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Vehicle Management
          </h3>
          <p className="text-sm text-gray-500">Add & view your vehicles</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleModuleCard;
