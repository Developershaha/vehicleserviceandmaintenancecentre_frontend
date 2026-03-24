import { useFormik } from "formik";
import VehicleInput from "../../common/VehicleInput";
import { useState } from "react";
import { object, string } from "yup";
import VehicleButton from "../../common/VehicleButton";
import axios from "axios";
import { showSnackbar } from "../../../store/snackbarSlice";
import { useAppDispatch } from "../../../store/hook";

type ForgetPasswordProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: { email: string }) => void;
};

const ForgetPassword = ({ open, onClose, onConfirm }: ForgetPasswordProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: object({
      username: string().required("Username required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:8087/vehicle/email/otp/send?username=${values.username}`,
        );

        if (response?.data?.validationCode === "otp.sent.on.registerd.email") {
          dispatch(
            showSnackbar({ message: "OTP sent successfully", type: "success" }),
          );
          // 👉 or use snackbar
        } else {
          dispatch(
            showSnackbar({ message: "Something went wrong", type: "success" }),
          );
        }

        formik.resetForm();
      } catch (error) {
        dispatch(
          showSnackbar({ message: "Failed to send OTP", type: "warning" }),
        );
      } finally {
        setLoading(false);
      }
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* ✅ Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl z-10">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></span>
          </div>
        )}
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          Enter your registered email to receive reset instructions.
        </p>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="mt-4 flex flex-col gap-4"
        >
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

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
