import Navbar from "../../Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Vehicle Service & Maintenance Centre
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow">
            Total Vehicles
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow">
            Services Today
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow">
            Pending Jobs
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
