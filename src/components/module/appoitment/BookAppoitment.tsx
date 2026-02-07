import { useFormik } from "formik";
import * as Yup from "yup";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import VehicleAutoSelectField from "../../common/VehicleAutoSelectField";
import VehicleTextarea from "../../common/VehicleTextarea";
import VehicleDateInput from "../../common/VehicleDateInput";
import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../../../store/snackbarSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store/hook";

interface BookAppoitmentProps {
  vehicles: any[]; // pass vehicles from parent
}

const validationSchema = Yup.object({
  aptVehId: Yup.mixed().required("Vehicle type required"),
  aptDate: Yup.string()
    .required("Appointment date required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be dd/mm/yyyy")
    .test("not-past-date", "Past dates are not allowed", (value) => {
      if (!value) return false;

      const [d, m, y] = value.split("/").map(Number);
      const selectedDate = new Date(y, m - 1, d);
      const today = new Date();

      today.setHours(0, 0, 0, 0); // normalize

      return selectedDate >= today;
    }),

  aptProblemDescription: Yup.string()
    .required("Problem description required")
    .min(10, "Minimum 10 characters required"),
});

const BookAppoitment = ({ vehicles }: BookAppoitmentProps) => {
  const vehicleOptions = vehicles.map((v) => ({
    label: v.vehVehicleNumber, // 👈 what user sees
    value: v.vehId, // 👈 what you submit
  }));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType } = useAppSelector((state) => state.auth);
  console.log("userType", userType);

  const formik = useFormik({
    initialValues: {
      aptVehId: null,
      aptDate: "",
      aptProblemDescription: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);

      try {
        await axiosInstance.post("/customer/appointments", null, {
          params: { ...values, aptVehId: values?.aptVehId?.value }, // ⚠️ API expects QUERY params
        });

        navigate("/appointments");
        dispatch(
          showSnackbar({
            message: "Vehicle deleted  successfully",
            type: "success",
          }),
        );
      } catch (error) {
        console.error("Booking failed", error);
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <VehicleAutoSelectField
          label="Appoitment vehicle Number"
          name="aptVehId"
          value={formik.values.aptVehId}
          options={vehicleOptions ?? []}
          onChange={(val) => formik.setFieldValue("aptVehId", val)}
          onBlur={formik.handleBlur}
          clearable
          required
          error={
            formik.touched.aptVehId
              ? (formik.errors.aptVehId as string)
              : undefined
          }
          touched={formik.touched.aptVehId}
        />

        <VehicleDateInput
          label="Appointment Date"
          name="aptDate"
          value={formik.values.aptDate}
          required
          onChange={(val) => formik.setFieldValue("aptDate", val)}
          onBlur={formik.handleBlur}
          error={formik.errors.aptDate}
          touched={formik.touched.aptDate}
        />

        <VehicleTextarea
          label="Problem Description"
          name="aptProblemDescription"
          value={formik.values.aptProblemDescription}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.aptProblemDescription}
          touched={formik.touched.aptProblemDescription}
          required
        />

        {/* Submit */}
        <div className="pt-2">
          <VehicleButton text="Book Appointment" type="submit" align="center" />
        </div>
      </form>
    </div>
  );
};

export default BookAppoitment;
