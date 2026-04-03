import { useEffect, useState } from "react";
import VehicleModuleCard from "../../module/vehicle/VehicleModuleCard";
import axiosInstance from "./apis/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const res = await axiosInstance.get("today/appointment");
        setAppointments(res?.data?.entity?.appointmentList || []);
      } catch (error) {
        console.error("Error fetching appointments", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back! Here’s your system overview.
        </p>
      </div>

      {/* 🔥 Modules */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Modules Overview
        </h2>
        <VehicleModuleCard />
      </div>

      {/* 🔥 Today's Appointments */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            📅 Today's Appointments
          </h2>
          <span className="text-sm text-gray-500">
            {appointments.length} total
          </span>
        </div>

        {/* Content */}
        {loadingAppointments ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No appointments today
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {appointments.map((apt) => (
              <div
                key={apt.aptId}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Top */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {apt.custFirstName} {apt.custSurname}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium
                    ${
                      apt.aptStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {apt.aptStatus}
                  </span>
                </div>

                {/* Vehicle */}
                <p className="text-sm text-gray-600">
                  🚗 {apt.vehVehicleNumber}
                </p>

                {/* Problem */}
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  📝 {apt.aptProblemDescription}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                  <p className="text-xs text-gray-400">
                    ⏱ {new Date(apt.aptCreated).toLocaleTimeString()}
                  </p>

                  <span
                    className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => navigate("/appointments")}
                  >
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
