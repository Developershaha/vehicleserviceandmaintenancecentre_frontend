import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import dayjs from "dayjs";
import { deleteVehicleApi } from "../hooks/useVehicle";
import ConfirmDeleteModal from "../../common/ConfirmDeleteModal";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";

const AppointmentList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehId, setSelectedVehId] = useState<number | null>(null);

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

  const handleDelete = async () => {
    if (!selectedVehId) return;

    try {
      const response = await deleteVehicleApi(selectedVehId);
      if (response?.data?.validationCode === "vehicle.delete.success") {
        dispatch(
          showSnackbar({
            message: "Vehicle deleted  successfully",
            type: "success",
          }),
        );

        fetchVehicles();
      }
    } catch (error) {
      console.error("Error deleting vehicle", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedVehId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            {" "}
            Vehicles List
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
                    Manufacture Year
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Added Date
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">
                    Delete Vehicle
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
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedVehId(vehicle.vehId);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-md bg-red-50 px-5 py-1.5
               text-sm font-medium text-red-600
               border border-red-200
               hover:bg-red-100 hover:border-red-300
               active:scale-95 transition-all duration-150"
                          title="Delete"
                        >
                          Delete
                        </button>
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
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedVehId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AppointmentList;
