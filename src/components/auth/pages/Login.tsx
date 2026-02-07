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
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
        Please Login Here
      </h2>

      <form onSubmit={formik.handleSubmit} className="flex flex-col">
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
        />{" "}
        {/* ✅ Button */}
        <div className="mt-4">
          <VehicleButton text="Login" type="submit" align="center" />
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </VehicleLayout>
  );
};

export default Login;
