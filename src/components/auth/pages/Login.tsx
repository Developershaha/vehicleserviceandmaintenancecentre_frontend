import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";

import VehicleButton from "../../common/VehicleButton";
import VehicleInput from "../../common/VehicleInput";
import VehicleLayout from "../../common/VehicleLayout";
import { object, string } from "yup";
import { loginApi } from "./apis/loginApi";
import { setJwt } from "../../../store/authSlice";
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

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("called");
        const response = await loginApi(values);

        const { Jwt, RefreshToken } = response.data.entity ?? {};
        if (response?.data?.validationCode === "user.login.success") {
          dispatch(setJwt(Jwt));
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
          type="password"
          required
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

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
