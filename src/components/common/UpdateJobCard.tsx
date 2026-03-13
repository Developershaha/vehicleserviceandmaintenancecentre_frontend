import { useFormik } from "formik";
import axiosInstance from "../auth/pages/apis/axiosInstance";
import VehicleButton from "./VehicleButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hook";
import { showSnackbar } from "../../store/snackbarSlice";
import { useEffect, useState } from "react";
import VehicleTextarea from "./VehicleTextarea";
import VehicleAutoSelectField, {
  type AutoSelectOption,
} from "./VehicleAutoSelectField";
import * as Yup from "yup";

// --- TypeScript Interfaces ---
interface JobCardEntity {
  jcAptId: number;
  jcCreated: string;
  jcCreatedBy: string;
  jcId: number;
  jcInspectionNotes: string | null;
  jcProgressPercentage: number;
  jcRecordStatus: string;
  jcRemarks: string | null;
  jcStatus: string;
  jcUpdated: string;
  jcUpdatedBy: string | null;
  jcWorkDone: string | null;
}

interface FormValues {
  jcStatus: AutoSelectOption | null;
  jcInspectionNotes: string;
}

const STATUS_OPTIONS = [
  { label: "Inspection", value: "INSPECTION" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Quality Check", value: "QUALITY_CHECK" },
  { label: "Ready for Delivery", value: "READY_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const UpdateJobCard = () => {
  const [loading, setLoading] = useState(false);
  const [jobCard, setJobCard] = useState<JobCardEntity | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state: appointmentId } = useLocation();

  const formik = useFormik<FormValues>({
    initialValues: {
      jcStatus: null,
      jcInspectionNotes: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      jcStatus: Yup.mixed().required("Status is required"),

      jcInspectionNotes: Yup.string().when("jcStatus", {
        is: (status: AutoSelectOption | null) =>
          ["IN_PROGRESS", "INSPECTION"].includes(status?.value || ""),
        then: (schema) =>
          schema.required(
            "Inspection notes are required when in progress or inspection",
          ),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
    }),
    onSubmit: async (values) => {
      try {
        await axiosInstance.put("/admin/job-cards", null, {
          params: {
            jcId: jobCard?.jcId,
            jcStatus: values.jcStatus?.value,
            jcInspectionNotes: values.jcInspectionNotes,
          },
        });

        dispatch(
          showSnackbar({
            message: "Job Card Updated Successfully",
            type: "success",
          }),
        );
        navigate("/appointments");
      } catch (error) {
        dispatch(
          showSnackbar({
            message: "Failed to update Job Card",
            type: "error",
          }),
        );
      }
    },
  });

  const getJobCardDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/job-cards", {
        params: { aptId: appointmentId },
      });

      const data: JobCardEntity = response?.data?.entity;
      setJobCard(data);

      formik.setValues({
        jcStatus:
          STATUS_OPTIONS?.find((item) => item?.value === data?.jcStatus) ||
          null,
        jcInspectionNotes:
          (data?.jcStatus === "IN_PROGRESS"
            ? data?.jcWorkDone
            : data?.jcInspectionNotes) ?? "",
      });
    } catch (error) {
      console.error("Error fetching job card", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      getJobCardDetails();
    }
  }, [appointmentId]);

  return (
    <>
      <div className="mb-4 flex items-center">
        <VehicleButton text="Back" onClick={() => navigate("/appointments")} />
      </div>

      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Update Job Card
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update job card status and notes
            </p>
          </div>

          {/* Job Card Details Display */}
          {jobCard && (
            <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <h2 className="text-xs font-bold  tracking-widest text-slate-500">
                  Job Card Created by: {jobCard.jcCreatedBy}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    jobCard?.jcRecordStatus === "approved"
                      ? "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {jobCard?.jcRecordStatus}
                </span>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 ">
                      Created at
                    </span>
                    <span className="text-sm text-slate-600">
                      {new Date(jobCard.jcCreated).toLocaleDateString(
                        "en-GB",
                      ) || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 ">
                      Updated By
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {jobCard.jcUpdatedBy || "-"}
                    </span>
                  </div>{" "}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 ">
                      Updated at
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(jobCard?.jcUpdated).toLocaleDateString(
                        "en-GB",
                      ) || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">
                      Current Phase:{" "}
                      {
                        STATUS_OPTIONS?.find(
                          (item) => item?.value === jobCard?.jcStatus,
                        )?.label
                      }
                    </span>
                    <span className="font-bold text-blue-600">
                      {jobCard?.jcProgressPercentage} %
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${jobCard?.jcProgressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <VehicleAutoSelectField
              label="Update Status"
              name="jcStatus"
              value={formik.values.jcStatus}
              options={STATUS_OPTIONS ?? []}
              onChange={(val) => formik.setFieldValue("jcStatus", val)}
              onBlur={formik.handleBlur}
              clearable
              required
              error={
                formik.touched.jcStatus
                  ? (formik.errors.jcStatus as string)
                  : undefined
              }
              touched={formik.touched.jcStatus}
            />

            <VehicleTextarea
              label="Job Inspection Notes"
              name="jcInspectionNotes"
              disabled={
                !["IN_PROGRESS", "INSPECTION"].includes(
                  formik.values.jcStatus?.value || "",
                )
              }
              value={formik.values.jcInspectionNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.jcInspectionNotes}
              touched={formik.touched.jcInspectionNotes}
              required
            />

            <div className="mt-8">
              <VehicleButton
                text={loading ? "Updating..." : "Update Job Card"}
                type="submit"
                align="center"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateJobCard;
