import { useFormik } from "formik";
import axiosInstance from "../auth/pages/apis/axiosInstance";
import VehicleInput from "./VehicleInput";
import VehicleButton from "./VehicleButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hook";
import { showSnackbar } from "../../store/snackbarSlice";
import { useEffect, useState } from "react";
import VehicleTextarea from "./VehicleTextarea";
import VehicleAutoSelectField from "./VehicleAutoSelectField";
import { mixed, object, string } from "yup";

const UpdateJobCard = () => {
  const [loading, setLoading] = useState(false);
  const [jobCard, setJobCard] = useState<any>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state: appointmentId } = useLocation();

  const formik = useFormik({
    initialValues: {
      jcStatus: null,
      jcInspectionNotes: "",
    },

    enableReinitialize: true,
    validationSchema: object({
      jcStatus: mixed().required("Vehicle type required"),

      jcInspectionNotes: string().required("Brand required"),
    }),

    onSubmit: async (values) => {
      try {
        await axiosInstance.put("/admin/job-cards", null, {
          params: {
            jcStatus: values.jcStatus,
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

      const data = response?.data?.entity;

      setJobCard(data);

      formik.setValues({
        jcStatus: data?.jcStatus || "",
        jcInspectionNotes: data?.jcInspectionNotes || "",
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
  }, []);

  return (
    <>
      {/* Back Button */}
      <div className="mb-4 flex items-center">
        <VehicleButton text="Back" onClick={() => navigate("/appointments")} />
      </div>

      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Update Job Card
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update job card status and inspection notes
            </p>
          </div>

          {/* Job Card Details */}
          {jobCard && (
            <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Header with Record Status */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Job Card Reference: #{jobCard.jcId}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    jobCard.jcRecordStatus === "approved"
                      ? "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {jobCard.jcRecordStatus}
                </span>
              </div>

              <div className="p-5">
                {/* Primary Details Grid */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  {/* Appointment Link */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Appointment
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      #{jobCard.jcAptId}
                    </span>
                  </div>

                  {/* Assigned To/Created By */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Technician
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {jobCard.jcCreatedBy}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Date Created
                    </span>
                    <span className="text-sm text-slate-600">
                      {new Date(jobCard.jcCreated).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <hr className="my-5 border-slate-100" />

                {/* Progress and Status Row */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        Current Phase:
                      </span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {jobCard.jcStatus}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">
                      {jobCard.jcProgressPercentage}% Complete
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-700 ease-out"
                      style={{ width: `${jobCard.jcProgressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Quick Info Footer */}
                {jobCard.jcUpdated && (
                  <div className="mt-4 text-right">
                    <p className="text-[10px] italic text-slate-400">
                      Last updated:{" "}
                      {new Date(jobCard.jcUpdated).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <VehicleAutoSelectField
              label="Job Card Status"
              name="jcStatus"
              value={formik.values.jcStatus}
              options={[]}
              onChange={(val) => formik.setFieldValue("vehVehicleType", val)}
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
              value={formik.values.jcInspectionNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.jcInspectionNotes}
              touched={formik.touched.jcInspectionNotes}
              required
            />
            <div className="mt-6">
              <VehicleButton
                text="Update Job Card"
                type="submit"
                align="center"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateJobCard;
