import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hook";
import { showSnackbar } from "../store/snackbarSlice";

import logo from "../assets/logo.png";
import VehicleButton from "../components/common/VehicleButton";
import VehicleInput from "../components/common/VehicleInput";
import VehicleLayout from "../components/common/VehicleLayout";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      showSnackbar({
        message: "Login successfully",
        type: "success",
        duration: 4,
        vertical: "top",
        horizontal: "center",
      }),
    );

    navigate("/dashboard");
  };

  return (
    <VehicleLayout
      logo={<img src={logo} alt="Logo" className="max-w-[300px]" />}
    >
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
        Please Login Here
      </h2>

      <form onSubmit={handleLogin}>
        <VehicleInput label="Username" placeholder="Enter username" required />

        <VehicleInput
          label="Password"
          type="password"
          placeholder="Enter password"
          required
        />

        {/* ✅ VehicleButton */}
        <VehicleButton text="Login" type="submit" align="center" />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </VehicleLayout>
  );
};

export default Login;
