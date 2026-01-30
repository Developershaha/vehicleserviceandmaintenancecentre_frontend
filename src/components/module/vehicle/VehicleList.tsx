import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import dayjs from "dayjs";

const VehicleList = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/customer/vehicles");
      setVehicles(response?.data?.entity || []);
    } catch (error) {
      console.error("Error fetching vehicles", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">My Vehicles</h1>

        <VehicleButton
          text="Add Vehicle"
          onClick={() => navigate("/vehicles/add")}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Vehicle Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Brand
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Model
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Manufacturing Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Created Date
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  Loading vehicles...
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.vehId}
                  className="border-t transition hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {vehicle.vehId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {vehicle.vehVehicleNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {vehicle.vehBrand}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {vehicle.vehModel}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                    {vehicle.vehVehicleType}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {vehicle.vehManufacturingYear}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        vehicle.vehRecordStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {vehicle.vehRecordStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {vehicle.vehUseUsername}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {dayjs(vehicle.vehCreated).format("DD/MM/YYYY")}
                  </td>
                </tr>
              ))}

            {/* Empty state */}
            {!loading && vehicles.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;
