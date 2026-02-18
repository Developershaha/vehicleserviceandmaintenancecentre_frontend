import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { showSnackbar } from "../store/snackbarSlice";
import { logout } from "../store/authSlice";
import { logoutApi } from "./auth/pages/apis/loginApi";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    const logoutResponse = await logoutApi(userDetails?.username ?? "");

    if (logoutResponse?.data?.validationCode === "logout.success") {
      dispatch(logout());
      dispatch(
        showSnackbar({
          message: "You have been logged out successfully.",
          type: "success",
        }),
      );
      navigate("/");
    }
  };

  return (
    <nav
      className="sticky top-0 z-50
                 flex items-center justify-between
                 bg-[oklch(95.3%_0.051_180.801)]
                 px-6 py-4
                 border-b border-slate-300"
    >
      <Link to="/dashboard">
        <h2
          className="inline-block rounded-md border border-slate-300 px-3 py-1
                     text-lg font-bold text-slate-900 cursor-pointer
                     hover:bg-slate-50 hover:border-slate-400 transition"
        >
          Vehicle Service Centre
        </h2>
      </Link>

      <div className="flex items-center space-x-4 text-slate-900">
        <Link to="/dashboard" className="hover:underline">
          Home
        </Link>
        <Link to="/services" className="hover:underline">
          Services
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-md px-3 py-1.5 text-sm font-semibold
                     bg-red-500 hover:bg-red-600 text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
