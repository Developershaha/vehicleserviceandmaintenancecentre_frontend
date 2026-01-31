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
      {/* Centered container (NOT full screen) */}
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            My Vehicles
          </h1>

          <VehicleButton
            text="Add Vehicle"
            onClick={() => navigate("/vehicles/add")}
          />
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Vehicle Number
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Brand
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Model
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Mfg Year
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Added Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500"
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
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2 text-gray-500">
                        {vehicle.vehId}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {vehicle.vehVehicleNumber}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {vehicle.vehBrand}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {vehicle.vehModel}
                      </td>
                      <td className="px-3 py-2 capitalize text-gray-700">
                        {vehicle.vehVehicleType}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {vehicle.vehManufacturingYear}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {dayjs(vehicle?.vehCreated).format("DD/MM/YYYY")}
                      </td>
                    </tr>
                  ))}

                {/* Empty state */}
                {!loading && vehicles.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No vehicles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
