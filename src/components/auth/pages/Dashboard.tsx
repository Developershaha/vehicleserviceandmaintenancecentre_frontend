import VehicleModuleCard from "../../module/vehicle/VehicleModuleCard";
import Navbar from "../../Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <VehicleModuleCard />
      </div>
    </>
  );
};

export default Dashboard;
