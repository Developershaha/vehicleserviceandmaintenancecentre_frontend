import { useState } from "react";
import { useFormik } from "formik";
import VehicleAutoSelectField from "./VehicleAutoSelectField";

type ConfirmAssignRejectModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (action: "assign" | "reject") => void;
  appointmentData: any;
};

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

const ConfirmAssignRejectModal = ({
  open,
  onClose,
  onConfirm,
  appointmentData,
}: ConfirmAssignRejectModalProps) => {
  const [action, setAction] = useState<"assign" | "reject">("assign");
  const approvedData =
    appointmentData?.aptStatus === "APPROVED"
      ? ASSIGN_REJECT_OPTIONS?.[0]
      : null;
  const rejectData =
    appointmentData?.aptStatus === "APPROVED"
      ? ASSIGN_REJECT_OPTIONS?.[0]
      : null;
  const formik = useFormik({
    initialValues: {
      vehVehicleType: ASSIGN_REJECT_OPTIONS?.[0],
    },
    onSubmit: () => {},
  });

  if (!open) return null;
  console.log(
    "first",
    appointmentData?.aptStatus === "APPROVED"
      ? ASSIGN_REJECT_OPTIONS?.[0]
      : null,
  );
  console.log(
    "appointmentData",
    appointmentData?.aptStatus === "APPROVED" ? ASSIGN_REJECT_OPTIONS?.[0] : "",
  );
  const isConfirmDisabled = !formik.values.vehVehicleType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal container */}
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800">
          Approve/Reject Appointment
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Please select an action for this appointment.
        </p>

        {/* Dropdown */}
        <div className="mt-5">
          <VehicleAutoSelectField
            label="Action"
            name="vehVehicleType"
            value={formik.values.vehVehicleType}
            options={ASSIGN_REJECT_OPTIONS}
            onChange={(val) => {
              formik.setFieldValue("vehVehicleType", val);
              setAction(val?.value);
            }}
            onBlur={formik.handleBlur}
            clearable
            required
            error={
              formik.touched.vehVehicleType
                ? (formik.errors.vehVehicleType as string)
                : undefined
            }
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-1.5
                       text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            disabled={isConfirmDisabled}
            onClick={() => {
              onConfirm(action);
              formik?.resetForm();
            }}
            className={`rounded-md px-4 py-1.5 text-sm font-medium text-white
              ${
                isConfirmDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : action === "reject"
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
