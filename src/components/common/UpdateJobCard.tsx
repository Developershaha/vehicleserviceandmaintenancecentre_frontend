import { useFormik } from "formik";
import axiosInstance from "../auth/pages/apis/axiosInstance";
import VehicleInput from "./VehicleInput";
import VehicleButton from "./VehicleButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hook";
import { showSnackbar } from "../../store/snackbarSlice";
import { useEffect, useState } from "react";
import VehicleTextarea from "./VehicleTextarea";

const UpdateJobCard = () => {
  const [loading, setLoading] = useState(false);
  const [jobCard, setJobCard] = useState<any>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state: appointmentId } = useLocation();

  const formik = useFormik({
    initialValues: {
      jcld: "",
      jcStatus: "",
      jcInspectionNotes: "",
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        await axiosInstance.put("/admin/job-cards", null, {
          params: {
            jcld: values.jcld,
            jcStatus: values.jcStatus,
            jcInspectionNotes: values.jcInspectionNotes,
          },
        });

        dispatch(
          showSnackbar({
            message: "Job Card Updated Successfully",
            severity: "success",
          }),
        );

        navigate("/appointments");
      } catch (error) {
        dispatch(
          showSnackbar({
            message: "Failed to update Job Card",
            severity: "error",
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
        jcld: data?.jcId || "",
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
            <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Header Section */}
              <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">
                  Job Card Information
                </h2>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-y-4 p-5 sm:grid-cols-2 sm:gap-x-8">
                {/* Job Card ID */}
                <div className="flex flex-col border-l-2 border-blue-500 pl-3">
                  <span className="text-xs font-medium text-gray-400">
                    Job Card ID
                  </span>
                  <span className="font-semibold text-gray-800">
                    {jobCard.jcId}
                  </span>
                </div>

                {/* Appointment ID */}
                <div className="flex flex-col border-l-2 border-indigo-500 pl-3">
                  <span className="text-xs font-medium text-gray-400">
                    Appointment ID
                  </span>
                  <span className="font-semibold text-gray-800">
                    #{jobCard.jcAptId}
                  </span>
                </div>

                {/* Created By */}
                <div className="flex flex-col border-l-2 border-gray-300 pl-3">
                  <span className="text-xs font-medium text-gray-400">
                    Technician / Admin
                  </span>
                  <span className="text-sm text-gray-700">
                    {jobCard.jcCreatedBy}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col border-l-2 border-emerald-500 pl-3">
                  <span className="text-xs font-medium text-gray-400 mb-1">
                    Current Status
                  </span>
                  <span className="inline-flex w-fit items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    {jobCard.jcStatus?.toUpperCase()}
                  </span>
                </div>

                {/* Progress Bar Section (Full Width) */}
                <div className="sm:col-span-2 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      Service Progress
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {jobCard.jcProgressPercentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${jobCard.jcProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <VehicleInput
              label="Vehicle Number"
              name="vehVehicleNumber"
              value={formik.values.jcStatus}
              onChange={(e) => {
                formik.setFieldValue(
                  "vehVehicleNumber",
                  e.target.value.toUpperCase(),
                );
              }}
              onBlur={formik.handleBlur}
              error={formik.errors.jcStatus}
              touched={formik.touched.jcStatus}
              required
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
