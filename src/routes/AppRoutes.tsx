import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../components/auth/pages/Login";
import Register from "../components/auth/pages/Register";
import Dashboard from "../components/auth/pages/Dashboard";
import Services from "../components/auth/pages/Services";
import NotFound from "../components/auth/pages/NotFound";
import VehicleList from "../components/module/vehicle/VehicleList";
import AddVehicle from "./AddVehicle";
import MainLayout from "../components/common/MainLayout";
import AppointmentList from "../components/module/appoitment/AppointmentList";
import AppoitmentBookOrVehicle from "../components/module/appoitment/AppoitmentBookOrVehicle";
import UserList from "../components/module/user/UserList";
import AddUser from "../components/module/user/AddUser";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth (NO Navbar) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App layout (WITH Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />

          {/* 🚗 Vehicle Module */}
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          {/* 🚗 Vehicle Module */}
          <Route path="/appointments" element={<AppointmentList />} />
          <Route
            path="/appointments/checkVehicles"
            element={<AppoitmentBookOrVehicle />}
          />
          <Route path="/appointments/add" element={<AddVehicle />} />
          {/* 👤 User Module */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<AddUser />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
