import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";
import { useCountUp } from "./useCountUp";
import axiosInstance from "../../auth/pages/apis/axiosInstance";

const VehicleModuleCard = () => {
  const navigate = useNavigate();
  const { userType } = useAppSelector((state) => state.auth);

  const [stats, setStats] = useState({
    vehicles: 0,
    appointments: 0,
    users: 0,
  });

  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchAllStats = async () => {
      // Only fetch if userType exists
      if (!userType) return;

      try {
        setLoadingStats(true);

        const [vRes, aRes, uRes] = await Promise.allSettled([
          // Vehicles
          userType === "admin"
            ? axiosInstance.get("/admin/vehicles", {
                params: { pageNumber: 1},
              })
            : axiosInstance.get("/customer/vehicles"),

          // Appointments
          userType === "admin"
            ? axiosInstance.get("/admin/appointments/list", {
                params: { pageNumber: 1 },
              })
            : userType === "mechanic"
              ? axiosInstance.get("/mechanic/appointments", {
                  params: { pageNumber: 1},
                })
              : axiosInstance.get("/customer/appointments"),

          // Users
          userType === "admin"
            ? axiosInstance.get("auth/user/list", { params: { pageNumber: 1 } })
            : Promise.resolve({ data: { entity: { userListCount: 1 } } }),
        ]);

        // Helper to get data safely from Promise.allSettled
        const vData = vRes.status === "fulfilled" ? vRes.value.data : null;
        const aData = aRes.status === "fulfilled" ? aRes.value.data : null;
        const uData = uRes.status === "fulfilled" ? uRes.value.data : null;

        setStats({
          vehicles:
            userType === "admin"
              ? (vData?.entity?.vehicleCount ?? 0)
              : Array.isArray(vData?.entity)
                ? vData.entity.length
                : 0,

          appointments:
            userType === "admin" || userType === "mechanic"
              ? (aData?.entity?.appointmentCount ?? 0)
              : Array.isArray(aData?.entity)
                ? aData.entity.length
                : 0,

          users: uData?.entity?.userListCount ?? uData?.entity?.userCount ?? 0,
        });
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAllStats();
  }, [userType]);

  // Apply animations
  const vCount = useCountUp(stats.vehicles);
  const aCount = useCountUp(stats.appointments);
  const uCount = useCountUp(stats.users);

  const cardClass =
    "group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Vehicle Card */}
      <div onClick={() => navigate("/vehicles")} className={cardClass}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            🚗
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              Vehicle Module
            </h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              <span className="text-blue-600 text-sm">{vCount}</span> Vehicles
              Registered
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-500/10">
          <div className="h-full bg-blue-500" style={{ width: "100%" }}></div>
        </div>
      </div>

      {/* Appointment Card */}
      <div onClick={() => navigate("/appointments")} className={cardClass}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            📅
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              Appointments
            </h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              <span className="text-emerald-600 text-sm">{aCount}</span>{" "}
              Bookings Total
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500/10">
          <div
            className="h-full bg-emerald-500"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>

      {/* User Card */}
      {userType === "admin" && (
        <div onClick={() => navigate("/users")} className={cardClass}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              👤
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                User Management
              </h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                <span className="text-purple-600 text-sm">{uCount}</span> Active
                Users
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-purple-500/10">
            <div
              className="h-full bg-purple-500"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModuleCard;
