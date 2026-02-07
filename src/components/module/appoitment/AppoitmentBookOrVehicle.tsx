import { useLocation, useNavigate } from "react-router-dom";
import BookAppoitment from "./BookAppoitment";
import VehicleButton from "../../common/VehicleButton";

const AppoitmentBookOrVehicle = () => {
  const {
    state: { vehicles },
  } = useLocation();
  const navigate = useNavigate();
  console.log("state", vehicles);
  return (
    <>
      {vehicles.length === 0 ? (
        <div className="rounded-xl  bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              No Vehicles Found
            </h1>

            <VehicleButton
              text="Add Vehicle"
              onClick={() =>
                navigate("/vehicles/add", {
                  state: { redirect: "fromAppoitment", vehicles },
                })
              }
            />
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
              🚗
            </div>

            <p className="max-w-md text-gray-600">
              You haven’t registered any vehicles yet. Please add a vehicle
              first to continue with appointment booking.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold text-gray-800">
            Book Appointment
          </h1>

          <BookAppoitment vehicles={vehicles} />
        </div>
      )}
    </>
  );
};

export default AppoitmentBookOrVehicle;
