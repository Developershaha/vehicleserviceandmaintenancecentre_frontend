import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { showSnackbar } from "../store/snackbarSlice";
import { logout } from "../store/authSlice";
import { logoutApi } from "./auth/pages/apis/loginApi";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.auth);
  const username = userDetails?.username;
  const { userType } = useAppSelector((state) => state.auth);
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
      className="
        sticky top-0 z-50
        flex items-center justify-between
        bg-gradient-to-r from-cyan-50 via-white to-indigo-50
        px-6 py-4
        border-b border-slate-300
        shadow-sm
      "
    >
      {/* LEFT: Logo */}

      {/* CENTER: User Info */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <h2
            className="
            inline-block rounded-md border border-slate-300 px-4 py-1.5
            text-lg font-bold text-slate-900 cursor-pointer
            hover:bg-white hover:border-slate-400 transition
          "
          >
            Vehicle Service Centre
          </h2>
        </Link>
        {/* Divider */}
        <div className="h-8 w-px bg-slate-300 hidden sm:block" />

        {/* User Info Container */}
        <div className="hidden sm:flex items-center gap-3 rounded-lg bg-white/70 px-3 py-1.5 border border-slate-200 shadow-sm">
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white text-sm font-bold uppercase">
            {username?.charAt(0) ?? "U"}
          </div>

          {/* Text */}
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-700 leading-tight">
              {username}
            </span>
            <span className="text-[10px] font-medium text-slate-400 capitalize">
              {userType} account
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Nav + Logout */}
      <div className="flex items-center space-x-6 text-slate-900">
        <Link
          to="/dashboard"
          className="font-medium hover:text-indigo-600 transition"
        >
          Home
        </Link>
        <Link
          to="/services"
          className="font-medium hover:text-indigo-600 transition"
        >
          Services
        </Link>

        <button
          onClick={handleLogout}
          className="
            rounded-lg px-4 py-1.5 text-sm font-semibold
            bg-red-500 hover:bg-red-600 text-white
            transition-all shadow-md active:scale-95
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
