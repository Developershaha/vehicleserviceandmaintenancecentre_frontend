import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import VehicleInput from "../components/common/VehicleInput";
import VehicleButton from "../components/common/VehicleButton";
import {
  addVehicleApi,
  type AddVehiclePayload,
} from "../components/module/hooks/useVehicle";
import type { AddVehicleFormValues } from "../components/module/types/vehicle";
import VehicleAutoSelectField from "../components/common/VehicleAutoSelectField";
import { VEHICLE_TYPE_OPTIONS } from "../components/common/common";

const validationSchema = Yup.object({
  vehVehicleNumber: Yup.string().required("Vehicle number required"),
  vehVehicleType: Yup.string().required("Vehicle type required"),
  vehBrand: Yup.string().required("Brand required"),
  vehModel: Yup.string().required("Model required"),
  vehManufacturingYear: Yup.number()
    .required("Manufacturing year required")
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Future year not allowed"),
});

const AddVehicle = () => {
  const navigate = useNavigate();

  const formik = useFormik<AddVehicleFormValues>({
    initialValues: {
      vehVehicleNumber: "",
      vehVehicleType: "", // ✅ correctly typed
      vehBrand: "",
      vehModel: "",
      vehManufacturingYear: "", // ✅ string initially
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload: AddVehiclePayload = {
        vehVehicleNumber: values.vehVehicleNumber,
        vehVehicleType: values.vehVehicleType as "car" | "bike",
        vehBrand: values.vehBrand,
        vehModel: values.vehModel,
        vehManufacturingYear: Number(values.vehManufacturingYear),
      };

      console.log("Add Vehicle Payload:", payload);
      await addVehicleApi(payload);
      // navigate("/vehicles");
    },
  });

  return (
    <>
      {/* Back */}
      <div className="mb-4 flex items-center">
        <VehicleButton text="Back" onClick={() => navigate("/vehicles")} />
      </div>

      <div className="flex justify-center px-4 py-10">
        <div className="relative w-full max-w-xl rounded-xl bg-white p-8 shadow-md hover:shadow-lg transition">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-gray-800">Add Vehicle</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your vehicle details to manage service bookings
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <VehicleInput
              label="Vehicle Number"
              name="vehVehicleNumber"
              value={formik.values.vehVehicleNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.vehVehicleNumber}
              touched={formik.touched.vehVehicleNumber}
              required
            />

            <VehicleAutoSelectField
              label="Vehicle Type"
              name="vehVehicleType"
              value={formik.values.vehVehicleType}
              options={VEHICLE_TYPE_OPTIONS}
              onChange={(val) => formik.setFieldValue("vehVehicleType", val)}
              onBlur={() => formik.setFieldTouched("vehVehicleType", true)}
              clearable
              required
              error={
                formik.touched.vehVehicleType
                  ? formik.errors.vehVehicleType
                  : undefined
              }
              touched={formik.touched.vehVehicleType}
            />

            <VehicleInput
              label="Brand"
              name="vehBrand"
              value={formik.values.vehBrand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.vehBrand}
              touched={formik.touched.vehBrand}
              required
            />
            <VehicleInput
              label="Model"
              name="vehModel"
              value={formik.values.vehModel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.vehModel}
              touched={formik.touched.vehModel}
              required
            />
            <VehicleInput
              label="Manufacturing Year"
              name="vehManufacturingYear"
              type="number"
              value={formik.values.vehManufacturingYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.vehManufacturingYear}
              touched={formik.touched.vehManufacturingYear}
              required
            />
            {/* Action */}
            <div className="mt-6">
              <VehicleButton text="Save Vehicle" type="submit" align="center" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVehicle;
