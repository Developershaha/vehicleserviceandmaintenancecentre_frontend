import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";

const VehicleList = () => {
  const navigate = useNavigate();

  const vehicles = [
    { id: 1, number: "MH12AB1234", model: "Honda City", type: "Car" },
    { id: 2, number: "MH14CD5678", model: "Royal Enfield", type: "Bike" },
    { id: 3, number: "MH15XY9876", model: "Hyundai i20", type: "Car" },
    { id: 4, number: "MH16PQ1122", model: "KTM Duke", type: "Bike" },
  ];

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
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Vehicle Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Model
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Type
              </th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm text-gray-800">
                  {vehicle.number}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {vehicle.model}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {vehicle.type}
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {vehicles.length === 0 && (
              <tr>
                <td
                  colSpan={3}
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
