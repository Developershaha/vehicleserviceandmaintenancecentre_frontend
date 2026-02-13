import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

import VehicleInput from "../components/common/VehicleInput";
import VehicleButton from "../components/common/VehicleButton";
import {
  addVehicleApi,
  type AddVehiclePayload,
} from "../components/module/hooks/useVehicle";
import type { AddVehicleFormValues } from "../components/module/types/vehicle";
import VehicleAutoSelectField from "../components/common/VehicleAutoSelectField";
import { VEHICLE_TYPE_OPTIONS } from "../components/common/common";
import { useAppDispatch } from "../store/hook";
import { showSnackbar } from "../store/snackbarSlice";

const currentYear: number = new Date().getFullYear();

const AddVehicle = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocation();
  const { redirect, vehicles } = state ?? {};

  const formik = useFormik<AddVehicleFormValues>({
    initialValues: {
      vehVehicleNumber: "",
      vehVehicleType: null, // ✅ correctly typed
      vehBrand: "",
      vehModel: "",
      vehManufacturingYear: "", // ✅ string initially
    },
    validationSchema: Yup.object({
      vehVehicleNumber: Yup.string()
        .required("Vehicle number required")
        .min(7, "Please enter correct vehicle number")
        .max(15, "Please enter correct vehicle number"),

      vehVehicleType: Yup.mixed().required("Vehicle type required"),

      vehBrand: Yup.string().required("Brand required"),

      vehModel: Yup.string().required("Model required"),

      vehManufacturingYear: Yup.string()
        .required("Manufacturing year is required")
        .matches(/^\d{4}$/, "Enter a valid 4-digit year")
        .test(
          "year-range",
          "Invalid year entered",
          (value?: string): boolean => {
            if (!value) return false;

            const year: number = Number(value);
            if (Number.isNaN(year)) return false;

            return year >= 1950 && year <= currentYear;
          },
        ),
    }),

    onSubmit: async (values) => {
      const payload: AddVehiclePayload = {
        vehVehicleNumber: values.vehVehicleNumber,
        vehVehicleType: values.vehVehicleType?.value,
        vehBrand: values.vehBrand,
        vehModel: values.vehModel,
        vehManufacturingYear: Number(values.vehManufacturingYear),
      };

      const response = await addVehicleApi(payload);
      if (response?.data?.validationCode === "vehicle.add.success") {
        if (redirect === "fromAppoitment") {
          dispatch(
            showSnackbar({
              message: "Vehicle added  successfully Now you can book appointment",
              type: "success",
            }),
          );
          navigate("/appointments/checkVehicles", {
            state: { vehicles },
          });
        } else {
          dispatch(
            showSnackbar({
              message: "Vehicle added  successfully",
              type: "success",
            }),
          );
          navigate("/vehicles");
        }
      }
    },
  });

  return (
    <>
      {/* Back */}
      <div className="mb-4 flex items-center">
        <VehicleButton
          text="Back"
          onClick={() => {
            if (redirect === "fromAppoitment") {
              navigate("/appointments", {
                state: { vehicles },
              });
            } else navigate("/vehicles");
          }}
        />
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
              onChange={(e) => {
                formik.setFieldValue(
                  "vehVehicleNumber",
                  e.target.value.toUpperCase(),
                );
              }}
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
              onBlur={formik.handleBlur} // ✅ important
              clearable
              required
              error={
                formik.touched.vehVehicleType
                  ? (formik.errors.vehVehicleType as string)
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
              value={formik.values.vehManufacturingYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.vehManufacturingYear}
              touched={formik.touched.vehManufacturingYear}
              required
            />

            {/* Action */}
            <div className="mt-6">
              <VehicleButton text="Add Vehicle" type="submit" align="center" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVehicle;
