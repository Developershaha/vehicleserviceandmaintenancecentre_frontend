import { useFormik } from "formik";
import * as Yup from "yup";
import VehicleInput from "../components/common/VehicleInput";
import VehicleButton from "../components/common/VehicleButton";

const validationSchema = Yup.object({
  vehicleNumber: Yup.string().required("Vehicle number required"),
  vehicleModel: Yup.string().required("Vehicle model required"),
  vehicleType: Yup.string().required("Vehicle type required"),
});

const AddVehicle = () => {
  const formik = useFormik({
    initialValues: {
      vehicleNumber: "",
      vehicleModel: "",
      vehicleType: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Add Vehicle Payload:", values);
      // Call API here
    },
  });

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-xl font-semibold">Add Vehicle</h1>

      <form onSubmit={formik.handleSubmit}>
        <VehicleInput
          label="Vehicle Number"
          name="vehicleNumber"
          value={formik.values.vehicleNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.vehicleNumber}
          touched={formik.touched.vehicleNumber}
          required
        />

        <VehicleInput
          label="Vehicle Model"
          name="vehicleModel"
          value={formik.values.vehicleModel}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.vehicleModel}
          touched={formik.touched.vehicleModel}
          required
        />

        <VehicleInput
          label="Vehicle Type (Car/Bike)"
          name="vehicleType"
          value={formik.values.vehicleType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.vehicleType}
          touched={formik.touched.vehicleType}
          required
        />

        <div className="mt-4">
          <VehicleButton text="Save Vehicle" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
