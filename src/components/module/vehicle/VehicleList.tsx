import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";

const VehicleList = () => {
  console.log("first");
  const navigate = useNavigate();

  // Dummy data (replace with API)
  const vehicles = [
    { id: 1, number: "MH12AB1234", model: "Honda City", type: "Car" },
    { id: 2, number: "MH14CD5678", model: "Royal Enfield", type: "Bike" },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Vehicles</h1>
        <VehicleButton
          text="Add Vehicle"
          onClick={() => navigate("/vehicles/add")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="font-medium text-gray-800">{vehicle.model}</h3>
            <p className="text-sm text-gray-500">
              {vehicle.type} • {vehicle.number}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
