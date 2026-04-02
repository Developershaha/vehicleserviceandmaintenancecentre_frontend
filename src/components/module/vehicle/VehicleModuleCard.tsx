import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";
import { useCountUp } from "./useCountUp";
import axiosInstance from "../../auth/pages/apis/axiosInstance";

// 1. Created a reusable Sub-Component for the cards
const StatCard = ({
  title,
  count,
  label,
  icon,
  colorClass,
  onClick,
  isLoading,
}: any) => (
  <div
    onClick={onClick}
    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
  >
    <div className="flex items-center gap-4">
      {/* Icon with dynamic color logic */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-all duration-300 
        ${
          colorClass === "blue"
            ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600"
            : colorClass === "emerald"
              ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600"
              : "bg-purple-50 text-purple-600 group-hover:bg-purple-600"
        } 
        group-hover:text-white group-hover:rotate-6`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-slate-900">
          {title}
        </h3>

        {/* Shimmer loading or Count */}
        {isLoading ? (
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-100" />
        ) : (
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
            <span
              className={`text-sm ${
                colorClass === "blue"
                  ? "text-blue-600"
                  : colorClass === "emerald"
                    ? "text-emerald-600"
                    : "text-purple-600"
              }`}
            >
              {count}
            </span>{" "}
            {label}
          </p>
        )}
      </div>
    </div>

    {/* Decorative bottom bar */}
    <div
      className={`absolute bottom-0 left-0 h-1 w-full opacity-20 
      ${colorClass === "blue" ? "bg-blue-500" : colorClass === "emerald" ? "bg-emerald-500" : "bg-purple-500"}`}
    />
  </div>
);

const VehicleModuleCard = () => {
  const navigate = useNavigate();
  const { userType } = useAppSelector((state) => state.auth);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    vehicles: 0,
    appointments: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      if (!userType) return;

      const todayData = await axiosInstance.get("today/appointment");
      console.log("todayData", todayData);
      try {
        setLoadingStats(true);
        const [vRes, aRes, uRes] = await Promise.allSettled([
          userType === "admin"
            ? axiosInstance.get("/admin/vehicles", {
                params: { pageNumber: 1 },
              })
            : axiosInstance.get("/customer/vehicles"),
          userType === "admin"
            ? axiosInstance.get("/admin/appointments/list", {
                params: { pageNumber: 1 },
              })
            : userType === "mechanic"
              ? axiosInstance.get("/mechanic/appointments", {
                  params: { pageNumber: 1 },
                })
              : axiosInstance.get("/customer/appointments"),
          userType === "admin"
            ? axiosInstance.get("auth/user/list", { params: { pageNumber: 1 } })
            : Promise.resolve({ data: { entity: { userListCount: 0 } } }),
        ]);

        const vData = vRes.status === "fulfilled" ? vRes.value.data : null;
        const aData = aRes.status === "fulfilled" ? aRes.value.data : null;
        const uData = uRes.status === "fulfilled" ? uRes.value.data : null;

        setStats({
          vehicles:
            userType === "admin"
              ? (vData?.entity?.vehicleCount ?? 0)
              : (vData?.entity?.length ?? 0),
          appointments:
            userType === "admin" || userType === "mechanic"
              ? (aData?.entity?.appointmentCount ?? 0)
              : (aData?.entity?.length ?? 0),
          users: uData?.entity?.userListCount ?? uData?.entity?.userCount ?? 0,
        });
      } catch (error) {
        console.error("Stats fetch failed", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchAllStats();
  }, [userType]);

  const vCount = useCountUp(stats.vehicles);
  const aCount = useCountUp(stats.appointments);
  const uCount = useCountUp(stats.users);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      <StatCard
        title="Vehicle Module"
        count={vCount}
        label="Vehicles Registered"
        icon="🚗"
        colorClass="blue"
        isLoading={loadingStats}
        onClick={() => navigate("/vehicles")}
      />

      <StatCard
        title="Appointments"
        count={aCount}
        label="Bookings Total"
        icon="📅"
        colorClass="emerald"
        isLoading={loadingStats}
        onClick={() => navigate("/appointments")}
      />

      {userType === "admin" && (
        <StatCard
          title="User Management"
          count={uCount}
          label="Users Register"
          icon="👤"
          colorClass="purple"
          isLoading={loadingStats}
          onClick={() => navigate("/users")}
        />
      )}
    </div>
  );
};

export default VehicleModuleCard;
