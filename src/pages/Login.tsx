import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../store/snackbarSlice";
import { useAppDispatch } from "../store/hook";
import { authStyles } from "./authStyles";
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
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className={authStyles.pageWrapper}>
      <div className={authStyles.card}>
        <h1 className={authStyles.title}>Vehicle Service</h1>
        <p className={authStyles.subtitle}>Maintenance & Service Centre</p>

        <form onSubmit={handleLogin} className={authStyles.form}>
          <input
            type="text"
            placeholder="Username"
            className={authStyles.input}
          />

          <input
            type="password"
            placeholder="Password"
            className={authStyles.input}
          />

          <button className={authStyles.button}>Login</button>
          <p className={authStyles.subtitle}>
            Don’t have an account?{" "}
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
