import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Always visible */}
      <Navbar />

      {/* Page content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
