import { useEffect, useState } from "react";
import { useFormik } from "formik";
import VehicleAutoSelectField from "./VehicleAutoSelectField";
import axiosInstance from "../auth/pages/apis/axiosInstance";

type MechanicOption = {
  label: string;
  value: string;
};

type AssignMechanicModalProps = {
  onClose: () => void;
  onConfirm: (mechanicUsername: string) => void;
};

const AssignMechanicModal = ({
  onClose,
  onConfirm,
}: AssignMechanicModalProps) => {
  const [mechanicOptions, setMechanicOptions] = useState<MechanicOption[]>([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     Fetch Mechanic List
  ======================= */
  const fetchMechanicList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/mechanic/list");

      const mappedOptions: MechanicOption[] =
        response?.data?.entity?.map((item: any) => ({
          value: item.useUsername,
          label: [item.useTitle, item.useFirstName, item.useSurname]
            .filter(Boolean)
            .join(" "),
        })) || [];

      setMechanicOptions(mappedOptions);
    } catch (error) {
      console.error("Error fetching mechanic list", error);
      setMechanicOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanicList();
  }, []);

  /* =======================
     Formik
  ======================= */
  const formik = useFormik({
    initialValues: {
      mechanic: null as MechanicOption | null,
    },
    onSubmit: () => {},
  });

  const isAssignDisabled = !formik.values.mechanic;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800">Assign Mechanic</h2>

        <p className="mt-2 text-sm text-gray-600">
          Select a mechanic to assign to this appointment.
        </p>

        {/* Dropdown */}
        <div className="mt-6">
          <VehicleAutoSelectField
            label="Mechanic"
            name="mechanic"
            value={formik.values.mechanic}
            options={mechanicOptions}
            onChange={(val) => formik.setFieldValue("mechanic", val)}
            onBlur={formik.handleBlur}
            clearable={false}
            required
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            className="rounded-md border border-gray-300 px-4 py-1.5
                       text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            disabled={isAssignDisabled}
            onClick={() => {
              onConfirm(formik.values.mechanic!.value);
              formik.resetForm();
            }}
            className={`rounded-md px-4 py-1.5 text-sm font-medium text-white
              ${
                isAssignDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
              active:scale-95 transition`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMechanicModal;
