import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";
import { object, string } from "yup";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { User, Lock, Eye, EyeOff, ChevronRight } from "lucide-react"; // Modern Icons

import VehicleButton from "../../common/VehicleButton";
import VehicleInput from "../../common/VehicleInput";
import ForgetPassword from "./ForgetPassword";
import { loginApi } from "./apis/loginApi";
import {
  setAuthTokens,
  setUserFromJwt,
  setUserType,
} from "../../../store/authSlice";
import logo from "../../../assets/logo.png";

const validationSchema = object({
  username: string().required("Username required"),
  password: string()
    .min(8, "Minimum 8 characters required")
    .required("Password required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginApi(values);
        const cookies = new Cookies();
        const { Jwt, RefreshToken, userType } = response.data.entity ?? {};

        if (response?.data?.validationCode === "user.login.success") {
          const decoded = jwtDecode(Jwt);

          const cookieOptions = { path: "/", secure: true, sameSite: "strict" };
          cookies.set("jwt", Jwt, cookieOptions);
          cookies.set("refreshToken", RefreshToken, cookieOptions);

          dispatch(setAuthTokens({ jwt: Jwt, refreshToken: RefreshToken }));
          dispatch(setUserType({ userType }));
          dispatch(
            setUserFromJwt({
              username: decoded.username,
              userId: decoded.sub,
              role: decoded.userRoles,
            }),
          );

          dispatch(showSnackbar({ message: "Welcome back!", type: "success" }));
          navigate("/dashboard");
        } else {
          dispatch(
            showSnackbar({ message: "Invalid credentials", type: "error" }),
          );
        }
      } catch (err) {
        dispatch(
          showSnackbar({
            message: "Server error. Try again later.",
            type: "error",
          }),
        );
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- LEFT SIDE: IMAGE & BRANDING --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden">
        {/* Replace this URL with your actual car image or a high-res Unsplash link */}
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-blue-900/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          <img src={logo} alt="Logo" className="w-40  invert" />

          <div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4">
              Manage your fleet <br /> with{" "}
              <span className="text-blue-400">precision.</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-md">
              The all-in-one platform for vehicle maintenance, diagnostics, and
              real-time analytics.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-blue-200">
            <span>© 2026 VehicleCare Inc.</span>
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <img src={logo} alt="Logo" className="w-32 mb-8 lg:hidden" />

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-1">
            <VehicleInput
              label="Username"
              name="username"
              required
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.username}
              touched={formik.touched.username}
              startIcon={<User size={18} />}
            />

            <VehicleInput
              label="Password"
              name="password"
              type={isShowPassword ? "text" : "password"}
              required
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              startIcon={<Lock size={18} />}
              endIcon={
                isShowPassword ? <EyeOff size={18} /> : <Eye size={18} />
              }
              onEndIconClick={() => setIsShowPassword(!isShowPassword)}
            />

            <div className="flex items-center justify-end py-2">
              <button
                type="button"
                onClick={() => setOpenForgot(true)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-4">
              <VehicleButton
                text="Sign in"
                type="submit"
                className="w-full py-4 rounded-xl shadow-lg shadow-blue-100 flex justify-center items-center gap-2"
                icon={<ChevronRight size={18} />}
              />
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <ForgetPassword
            open={openForgot}
            onClose={() => {
              setOpenForgot(false);
            }}
          />
          {/* Register */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              className="cursor-pointer text-blue-600 hover:underline font-medium"
              onClick={() => navigate("/register")}
            >
              Create account
            </span>
          </p>
        </div>
      </div>

      <ForgetPassword open={openForgot} onClose={() => setOpenForgot(false)} />
    </div>
  );
};

export default Login;
