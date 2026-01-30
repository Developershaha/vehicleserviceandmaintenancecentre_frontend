import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { useAppSelector } from "../../store/hook";

const MainLayout = () => {
  const { jwt } = useAppSelector((state) => state.auth);

  console.log("jwt", jwt);
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
