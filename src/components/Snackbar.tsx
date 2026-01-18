import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { hideSnackbar } from "../store/snackbarSlice";

const Snackbar = () => {
  const dispatch = useAppDispatch();
  const {
    snackbarOpen,
    snackbarType,
    snackbarMessage,
    snackbarAutoHideDuration,
    snackbarVertical,
    snackbarHorizontal,
  } = useAppSelector((state) => state.snackbar);

  const bgColorMap: Record<string, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-600",
  };

  const verticalClass = snackbarVertical === "top" ? "top-6" : "bottom-6";

  const horizontalClass =
    snackbarHorizontal === "center"
      ? "left-6"
      : snackbarHorizontal === "center"
      ? "right-6"
      : "left-1/2 -translate-x-1/2";

  useEffect(() => {
    if (!snackbarOpen) return;

    const timer = setTimeout(() => {
      dispatch(hideSnackbar());
    }, snackbarAutoHideDuration * 1000);

    return () => clearTimeout(timer);
  }, [snackbarOpen]);

  if (!snackbarOpen) return null;

  return (
    <div className={`fixed z-50 ${verticalClass} ${horizontalClass}`}>
      <div
        className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-white
        ${bgColorMap[snackbarType]}`}
      >
        <p className="max-w-sm whitespace-pre-line text-sm">
          {snackbarMessage}
        </p>

        <button
          className="ml-4 text-white/80 hover:text-white"
          onClick={() => dispatch(hideSnackbar())}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
