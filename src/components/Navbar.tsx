import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { showSnackbar } from "../store/snackbarSlice";
import { logout } from "../store/authSlice";
import { logoutApi } from "./auth/pages/apis/loginApi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To handle active link states
  const dispatch = useAppDispatch();

  const { username, userType } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const logoutResponse = await logoutApi(username ?? "");

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
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Helper to check if a link is active
  const isActive = (path: string) => location.pathname === path;

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
        {/* <div className="h-8 w-px bg-slate-300 hidden sm:block" /> */}
      </div>

      {/* RIGHT: Nav Links + Logout */}
      <div className="flex items-center space-x-8">
        {/* Navigation Group */}
        <div className="flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`relative group py-2 text-xs font-black uppercase tracking-widest transition-colors ${
              isActive("/dashboard")
                ? "text-indigo-600"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            Home
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                isActive("/dashboard") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>

          <Link
            to="/services"
            className={`relative group py-2 text-xs font-black uppercase tracking-widest transition-colors ${
              isActive("/services")
                ? "text-indigo-600"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            Services
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                isActive("/services") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
        </div>
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
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            group flex items-center gap-2
            rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest
            bg-rose-50 text-rose-600 border border-rose-100
            hover:bg-rose-600 hover:text-white hover:border-rose-600
            transition-all duration-300 shadow-sm hover:shadow-rose-200
            active:scale-95
          "
        >
          <span>Logout</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
