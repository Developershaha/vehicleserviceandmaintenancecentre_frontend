import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../components/auth/pages/Login";
import Register from "../components/auth/pages/Register";
import Dashboard from "../components/auth/pages/Dashboard";
import Services from "../components/auth/pages/Services";
import NotFound from "../components/auth/pages/NotFound";
import VehicleList from "../components/module/vehicle/VehicleList";
import AddVehicle from "./AddVehicle";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />

        {/* 🚗 Vehicle Module */}
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/vehicles/add" element={<AddVehicle />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
