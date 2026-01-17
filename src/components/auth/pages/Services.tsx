import Navbar from "../../Navbar";

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Services</h1>

        <ul className="mt-4 space-y-3">
          <li className="rounded bg-white p-4 shadow">Oil Change</li>
          <li className="rounded bg-white p-4 shadow">Brake Service</li>
          <li className="rounded bg-white p-4 shadow">Engine Check</li>
        </ul>
      </div>
    </>
  );
};

export default Services;
