import { useFormik } from "formik";
import VehicleInput from "../../common/VehicleInput";
import { useState } from "react";
import { object, string } from "yup";
import axios from "axios";
import { showSnackbar } from "../../../store/snackbarSlice";
import { useAppDispatch } from "../../../store/hook";

type ForgetPasswordProps = {
  open: boolean;
  onClose: () => void;
};

const ForgetPassword = ({ open, onClose }: ForgetPasswordProps) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      otp: "",
      password: "",
    },

    validationSchema: object({
      username: string().required("Username required"),

      otp: otpSent
        ? string()
            .matches(/^\d{6}$/, "OTP must be 6 digits")
            .required("OTP required")
        : string(),

      password: otpVerified
        ? string()
            .min(8, "Minimum 8 characters required")
            .required("Password required")
        : string(),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);

        // ✅ STEP 1: SEND OTP
        if (!otpSent) {
          const res = await axios.get(
            "http://localhost:8087/vehicle/email/otp/send",
            {
              params: { username: values.username },
            },
          );

          if (res?.data?.validationCode === "otp.sent.on.registerd.email") {
            setOtpSent(true);
            dispatch(
              showSnackbar({
                message: "OTP sent successfully",
                type: "success",
              }),
            );
          } else {
            dispatch(
              showSnackbar({
                message: "Failed to send OTP",
                type: "error",
              }),
            );
          }

          // ✅ STEP 2: VERIFY OTP
        } else if (!otpVerified) {
          if (values.otp.length !== 6) return;

          const res = await axios.get(
            "http://localhost:8087/vehicle/email/otp/verify",
            {
              params: {
                username: values.username,
                otp: values.otp,
              },
            },
          );

          if (res?.data?.validationCode === "otp.matched") {
            setOtpVerified(true);
            dispatch(
              showSnackbar({
                message: "OTP verified successfully",
                type: "success",
              }),
            );
          } else {
            dispatch(
              showSnackbar({
                message: "Invalid OTP",
                type: "error",
              }),
            );
          }

          // ✅ STEP 3: CHANGE PASSWORD
        } else {
          const res = await axios.get(
            "http://localhost:8087/vehicle/confirm/password",
            {
              params: {
                username: values.username,
                password: values.password,
              },
            },
          );

          if (res?.status === 200) {
            dispatch(
              showSnackbar({
                message: "Password changed successfully",
                type: "success",
              }),
            );

            formik.resetForm();
            setOtpSent(false);
            setOtpVerified(false);
            onClose();
          } else {
            dispatch(
              showSnackbar({
                message: "Failed to change password",
                type: "error",
              }),
            );
          }
        }
      } catch (err: any) {
        dispatch(
          showSnackbar({
            message: err?.response?.data?.message || "Something went wrong",
            type: "error",
          }),
        );
      } finally {
        setLoading(false);
      }
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* ✅ Loader */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-2xl z-10">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-purple-500"></span>
            <p className="mt-2 text-sm text-gray-600">Processing...</p>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>

        <p className="mt-2 text-sm text-gray-600">
          Enter your username to receive OTP.
        </p>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-4 flex flex-col gap-4"
        >
          {/* Username */}
          <VehicleInput
            label="Username"
            name="username"
            required
            disabled={otpSent}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.username}
            touched={formik.touched.username}
          />

          {/* OTP */}
          {otpSent && (
            <VehicleInput
              label="Enter OTP"
              name="otp"
              required
              value={formik.values.otp}
              onChange={(e: any) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 6) {
                  formik.setFieldValue("otp", value);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.errors.otp}
              touched={formik.touched.otp}
            />
          )}

          {/* Password */}
          {otpVerified && (
            <VehicleInput
              label="New Password"
              name="password"
              type="password"
              required
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
            />
          )}

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setOtpSent(false);
                setOtpVerified(false);
                onClose();
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                (!otpSent && !formik?.values?.username) ||
                (otpSent && !otpVerified && formik?.values?.otp?.length !== 6) ||
                (otpVerified && formik?.values?.password?.length < 8)
              }
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!otpSent
                ? "Send OTP"
                : !otpVerified
                  ? "Verify OTP"
                  : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
