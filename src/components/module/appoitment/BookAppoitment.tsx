import { useFormik } from "formik";
import * as Yup from "yup";
import VehicleButton from "../../common/VehicleButton";
import VehicleInput from "../../common/VehicleInput";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import VehicleAutoSelectField from "../../common/VehicleAutoSelectField";
import VehicleTextarea from "../../common/VehicleTextarea";
import VehicleDateInput from "../../common/VehicleDateInput";

interface BookAppoitmentProps {
  vehicles: any[]; // pass vehicles from parent
}

const validationSchema = Yup.object({
  aptVehId: Yup.mixed().required("Vehicle type required"),

  // aptDate: Yup.string()
  //   .required("Appointment date required")
  //   .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in dd/mm/yyyy format"),
  aptDate: Yup.string()
    .required("Appointment date required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be dd/mm/yyyy"),

  aptProblemDescription: Yup.string()
    .required("Problem description required")
    .min(10, "Minimum 10 characters required"),
});

const BookAppoitment = ({ vehicles }: BookAppoitmentProps) => {
  const vehicleOptions = vehicles.map((v) => ({
    label: v.vehVehicleNumber, // 👈 what user sees
    value: v.vehId, // 👈 what you submit
  }));

  const formik = useFormik({
    initialValues: {
      aptVehId: null,
      aptDate: "",
      aptProblemDescription: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("/customer/appointments", null, {
          params: values, // ⚠️ API expects QUERY params
        });

        alert("Appointment booked successfully");
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

        {/* Appointment Date */}
        {/* <VehicleInput
          label="Appointment Date (dd/mm/yyyy)"
          name="aptDate"
          value={formik.values.aptDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.aptDate}
          touched={formik.touched.aptDate}
          required
        /> */}
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
