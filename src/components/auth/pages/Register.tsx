import { useNavigate } from "react-router-dom";
import { authStyles } from "./authStyles";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";
import VehicleButton from "../../common/VehicleButton";

import VehicleInput from "../../common/VehicleInput";
import { useFormik } from "formik";
import { registerApi } from "./apis/loginApi";
import { object, ref, string } from "yup";
import { useState } from "react";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import VehicleAutoSelectField, {
  type AutoSelectOption,
} from "../../common/VehicleAutoSelectField";
import { TITLE_OPTIONS } from "../../common/common";

const validationSchema = object({
  firstName: string().required("First name required"),
  lastName: string().required("Last name required"),

  username: string()
    .min(4, "Minimum 4 characters required")
    .required("Username required"),

  mobile: string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number required"),

  email: string().email("Invalid email").required("Email required"),

  password: string()
    .min(8, "Minimum 8 characters required")
    .required("Password required"),

  confirmPassword: string()
    .oneOf([ref("password")], "Passwords do not match")
    .required("Confirm password required"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);
  const formik = useFormik<{
    firstName: string;
    lastName: string;
    username: string;
    mobile: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: AutoSelectOption | null;
  }>({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: null, //
    },
    validationSchema,

    onSubmit: async (values) => {
      console.log("first", values);
      try {
        const payload = {
          useUsername: values.username,
          useTitle: values?.gender, // or dynamic later
          useFirstName: values.firstName,
          useSurname: values.lastName,
          useEmail: values.email,
          useMobile: values.mobile,
          usePassword: values.password,
          useActive: 1,
          useType: "customer",
        };
        console.log("Register value:", values);
        console.log("Register Payload:", payload);
        await registerApi(payload);
        // return;

        dispatch(
          showSnackbar({
            message: "Registration successful. Please login.",
            type: "success",
          }),
        );

        navigate("/");
      } catch (err) {
        dispatch(
          showSnackbar({
            message: "Registration failed",
            type: "error",
          }),
        );
      }
    },
  });

  return (
    <div className={authStyles.pageWrapper}>
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl rounded-xl bg-white p-8 md:p-10 shadow-lg">
        <h1 className={authStyles.title}>Create Account</h1>
        <p className={authStyles.subtitle}>
          Register to access Vehicle Service Centre
        </p>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          {/* 👤 First & Last Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <VehicleAutoSelectField
              label="Title"
              name="gender"
              value={formik.values.gender}
              options={TITLE_OPTIONS}
              onChange={(val) => formik.setFieldValue("gender", val)}
              onBlur={() => formik.setFieldTouched("gender", true)}
              clearable
              error={formik.touched.gender ? formik.errors.gender : undefined}
              touched={formik.touched.gender}
            />

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
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <VehicleInput
              label="First Name"
              name="firstName"
              required
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
            />
            <VehicleInput
              label="Last Name"
              name="lastName"
              required
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
            />
          </div>

          {/* 👤 Username & Mobile */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <VehicleInput
              label="Mobile Number"
              name="mobile"
              required
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.mobile}
              touched={formik.touched.mobile}
            />
            <VehicleInput
              label="Email"
              name="email"
              type="email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
            />
          </div>

          {/* 🔐 Passwords */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              endIcon={
                isShowPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )
              }
              onEndIconClick={() => setIsShowPassword((prev) => !prev)}
            />

            <VehicleInput
              label="Confirm Password"
              name="confirmPassword"
              type={isConfirmPassword ? "password" : "text"}
              required
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              endIcon={
                isConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )
              }
              onEndIconClick={() => setIsConfirmPassword((prev) => !prev)}
            />
          </div>
          {/* 📧 Email (full width) */}

          {/* ✅ Button */}
          <div className="pt-2">
            <VehicleButton text="Register" type="submit" align="center" />
          </div>
        </form>

        <p className={`${authStyles.subtitle} mt-4`}>
          Already have an account?{" "}
          <span
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
