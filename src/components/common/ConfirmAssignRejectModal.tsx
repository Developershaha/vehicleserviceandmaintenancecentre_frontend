import { useState } from "react";
import VehicleAutoSelectField from "./VehicleAutoSelectField";
import { useFormik } from "formik";

type ConfirmAssignRejectModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (action: "assign" | "reject") => void;
};

const ConfirmAssignRejectModal = ({
  open,
  onClose,
  onConfirm,
}: ConfirmAssignRejectModalProps) => {
  const [action, setAction] = useState<"assign" | "reject">("assign");
  const [vehicleType, setVehicleType] = useState<any>(null);
  const formik = useFormik({
    initialValues: {
      vehVehicleType: null,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  if (!open) return null;
  const ASSIGN_REJECT_OPTIONS = [
    {
      label: "Assign",
      value: "assign",
    },
    {
      label: "Reject",
      value: "reject",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">
          Assign / Reject Appointment
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Please select an action for this appointment.
        </p>

        {/* Dropdown */}
        <VehicleAutoSelectField
          label="Vehicle Type"
          name="vehVehicleType"
          value={formik?.values?.vehVehicleType}
          options={ASSIGN_REJECT_OPTIONS}
          onChange={(val) => {
            formik.setFieldValue("vehVehicleType", val);
          }}
          onBlur={formik.handleBlur}
          clearable
          required
          error={
            formik.touched.vehVehicleType
              ? (formik.errors.vehVehicleType as string)
              : undefined
          }
          touched={formik.touched.vehVehicleType}
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-1.5
                       text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(action)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium text-white
              ${
                action === "reject"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }
              active:scale-95 transition`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAssignRejectModal;
