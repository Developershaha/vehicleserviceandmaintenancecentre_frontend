import { useLocation, useNavigate } from "react-router-dom";
import BookAppoitment from "./BookAppoitment";
import AddVehicle from "../../../routes/AddVehicle";
import VehicleButton from "../../common/VehicleButton";

const AppoitmentBookOrVehicle = () => {
  const {
    state: { vehicles },
  } = useLocation();
  const navigate = useNavigate();
  console.log("state", vehicles);
  return (
    <>
      {vehicles?.length === 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800"> </h1>

            <VehicleButton
              text="Add Vehicle"
              onClick={() => navigate("/vehicles/add")}
            />
          </div>
          <h6>
            No vehicle registed yet before going to book appoitment first
            registere vehicel then book appointment
          </h6>
          {/* <BookAppoitment /> */}
        </div>
      ) : (
        <AddVehicle />
      )}
    </>
  );
};

export default AppoitmentBookOrVehicle;
