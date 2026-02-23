import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

const VehicleModuleCard = () => {
  const navigate = useNavigate();
  const { userType } = useAppSelector((state) => state.auth);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Vehicle Module */}
      <div
        onClick={() => navigate("/vehicles")}
        className="group cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition
                   hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-3xl">
            🚗
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
              Vehicle Module
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage vehicles & details
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Module */}
      <div
        onClick={() => navigate("/appointments")}
        className="group cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition
                   hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-3xl">
            📅
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600">
              Appointment Module
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Schedule & track visits
            </p>
          </div>
        </div>
      </div>

      {/* User Module (Admin only) */}
      {userType === "admin" && (
        <div
          onClick={() => navigate("/users")}
          className="group cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition
                     hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 text-3xl">
              👤
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">
                User Module
              </h3>
              <p className="mt-1 text-sm text-gray-500">Manage system users</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModuleCard;
