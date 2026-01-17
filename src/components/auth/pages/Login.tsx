import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";

import logo from "../assets/logo.png";
import VehicleButton from "../../common/VehicleButton";
import VehicleInput from "../../common/VehicleInput";
import VehicleLayout from "../../common/VehicleLayout";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validate: (values) => {
      const errors: any = {};

      if (!values.username) {
        errors.username = "Username required";
      }

      if (!values.password) {
        errors.password = "Password required";
      }

      return errors;
    },

    onSubmit: (values) => {
      const postObj = {
        username: values.username,
        password: values.password,
      };

      console.log("POST OBJ 👉", postObj);

      dispatch(
        showSnackbar({
          message: "Login successfully",
        }),
      );

      navigate("/dashboard");
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
