import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/auth/pages/Login";
import Dashboard from "../components/auth/pages/Dashboard";
import Services from "../components/auth/pages/Services";
import NotFound from "../components/auth/pages/NotFound";
import Register from "../components/auth/pages/Register";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
