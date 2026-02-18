import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

const VehicleModuleCard = () => {
  const navigate = useNavigate();
  const { userType } = useAppSelector((state) => state.auth);

  return (
    <div className="flex gap-6">
      {/* Vehicle Module */}
      <div
        onClick={() => navigate("/vehicles")}
        className="cursor-pointer w-1/6 rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-blue-100 text-4xl">
            🚗
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800">
            Vehicle Module
          </h3>
        </div>
      </div>

      {/* Appointment Module */}
      <div
        onClick={() => navigate("/appointments")}
        className="cursor-pointer w-1/6 rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-green-100 text-4xl">
            📅
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800">
            Appointment Module
          </h3>
        </div>
      </div>

      {/* User Module */}
      {userType === "admin" && (
        <div
          onClick={() => navigate("/users")}
          className="cursor-pointer w-1/6 rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-purple-100 text-4xl">
              👤
            </div>

            <h3 className="text-center text-lg font-semibold text-gray-800">
              User Module
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModuleCard;
