import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { showSnackbar } from "../store/snackbarSlice";
import { useAppDispatch } from "../store/hook";
import { authStyles } from "./authStyles";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Password mismatch
    if (form.password !== form.confirmPassword) {
      dispatch(
        showSnackbar({
          message: "Password and Confirm Password do not match",
          type: "error",
          duration: 4,
          vertical: "top",
          horizontal: "center",
        })
      );
      return;
    }

    // ✅ Success
    dispatch(
      showSnackbar({
        message: "Registration successful. Please login.",
        type: "success",
        duration: 4,
        vertical: "top",
        horizontal: "center",
      })
    );

    navigate("/");
  };

  return (
    <div className={authStyles.pageWrapper}>
      <div className={authStyles.card}>
        <h1 className={authStyles.title}>Create Account</h1>
        <p className={authStyles.subtitle}>
          Register to access Vehicle Service Centre
        </p>

        <form onSubmit={handleRegister} className={authStyles.form}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={authStyles.input}
            value={form.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={authStyles.input}
            value={form.lastName}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            className={authStyles.input}
            value={form.mobile}
            onChange={handleChange}
            pattern="[0-9]{10}"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className={authStyles.input}
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={authStyles.input}
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className={authStyles.input}
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            className={authStyles.button}
            // onClick={() => navigate("/dashboard")}
          >
            Register
          </button>
        </form>

        <p className={authStyles.subtitle}>
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
