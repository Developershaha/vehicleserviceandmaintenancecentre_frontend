import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";

import VehicleButton from "../../common/VehicleButton";
import VehicleInput from "../../common/VehicleInput";
import VehicleLayout from "../../common/VehicleLayout";
import { object, string } from "yup";
import { loginApi } from "./apis/loginApi";
import { setJwt, setUserFromJwt } from "../../../store/authSlice";
import logo from "../../../assets/logo.png";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";

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

        const { Jwt, RefreshToken } = response.data.entity ?? {};
        if (response?.data?.validationCode === "user.login.success") {
          const userDetails: JwtPayload = jwtDecode(Jwt);
          console.log("Jwt", userDetails);

          dispatch(setJwt(Jwt));

          dispatch(
            setUserFromJwt({
              username: userDetails.username,
              userId: userDetails.sub,
              role: userDetails.userRoles,
            }),
          );
          localStorage.setItem("refreshToken", RefreshToken);

          dispatch(
            showSnackbar({
              message: "Login successfully",
              type: "success",
            }),
          );

          navigate("/dashboard");
        }
      } catch (err) {
        console.log("err", err);
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
