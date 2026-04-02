import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";

import VehicleButton from "../../common/VehicleButton";
import VehicleInput from "../../common/VehicleInput";
import VehicleLayout from "../../common/VehicleLayout";
import { object, string } from "yup";
import { loginApi } from "./apis/loginApi";
import {
  setAuthTokens,
  setUserFromJwt,
  setUserType,
} from "../../../store/authSlice";
import logo from "../../../assets/logo.png";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import Cookies from "universal-cookie";
import ForgetPassword from "./ForgetPassword";

const validationSchema = object({
  username: string().required("Username required"),
  password: string()
    .min(8, "Minimum 8 characters required")
    .required("Password required"),
});
// types/jwt.ts
export interface JwtPayload {
  sub: string;
  username: string;
  userRoles: string;
  iat: number;
  exp: number;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [openForgot, setOpenForgot] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginApi(values);
        const cookies = new Cookies();

        const { Jwt, RefreshToken, userType } = response.data.entity ?? {};

        if (response?.data?.validationCode === "user.login.success") {
          const decoded = jwtDecode<JwtPayload>(Jwt);

          // ✅ Save tokens in cookies
          cookies.set("jwt", Jwt, {
            path: "/",
            secure: true,
            sameSite: "strict",
          });

          cookies.set("refreshToken", RefreshToken, {
            path: "/",
            secure: true,
            sameSite: "strict",
          });

          // ✅ Save tokens in Redux
          dispatch(
            setAuthTokens({
              jwt: Jwt,
              refreshToken: RefreshToken,
            }),
          );
          dispatch(
            setUserType({
              userType,
            }),
          );

          dispatch(
            setUserFromJwt({
              username: decoded.username,
              userId: decoded.sub,
              role: decoded.userRoles,
            }),
          );

          dispatch(
            showSnackbar({
              message: "Login successful",
              type: "success",
            }),
          );

          navigate("/dashboard");
        } else if (
          response?.data?.validationCode === "username.or.password.incorrect"
        ) {
          dispatch(
            showSnackbar({
              message: "Invalid username or password",
              type: "error",
            }),
          );
        }
      } catch (err) {
        dispatch(
          showSnackbar({
            message: "Invalid username or password",
            type: "error",
          }),
        );
      }
    },
  });
  const icon = isShowPassword ? (
    <EyeSlashIcon className="h-5 w-5" />
  ) : (
    <EyeIcon className="h-5 w-5" />
  );
  return (
    <VehicleLayout
      logo={<img src={logo} alt="Logo" className="max-w-[300px]" />}
    >
      <>
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please login to continue
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <VehicleInput
            label="Username"
            name="username"
            required
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.username}
            touched={formik.touched.username}
          />

          <VehicleInput
            label="Password"
            name="password"
            type={isShowPassword ? "password" : "text"}
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            endIcon={icon}
            onEndIconClick={() => setIsShowPassword((prev) => !prev)}
          />
        </form>
      </>
      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="mt-4 flex items-center justify-between">
          <span
            className="cursor-pointer text-blue-600 text-sm hover:underline"
            onClick={() => setOpenForgot(true)}
          >
            Forgot Password?
          </span>

          <VehicleButton text="Login" type="submit" />
        </div>
      </form>{" "}
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
    </VehicleLayout>
  );
};

export default Login;
