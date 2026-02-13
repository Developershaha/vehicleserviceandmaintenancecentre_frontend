import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import dayjs from "dayjs";
import ConfirmDeleteModal from "../../common/ConfirmDeleteModal";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";
import ConfirmAssignRejectModal from "../../common/ConfirmAssignRejectModal";

const AppointmentList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [AppoitnmentList, setAppoitmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState<number | null>(null);
  const { userType } = useAppSelector((state) => state.auth);
  const [showAssignRejectModal, setShowAssignRejectModal] = useState(false);

  const handleAssignReject = async (action: "assign" | "reject") => {
    if (!selectedAptId) return;
    let response: any;
    try {
      if (action === "assign") {
        response = await axiosInstance.put(
          "/customer/appointments/approve",
          null,
          {
            params: {
              aptId: selectedAptId,
            },
          },
        );
      } else {
        response = await axiosInstance.put(
          "/customer/appointments/reject",
          null,
          {
            params: {
              aptId: selectedAptId,
            },
          },
        );
      }

      if (response?.data?.validationCode === "appointment.approved") {
        dispatch(
          showSnackbar({
            message: "Appoitment Approved successfully",
            type: "success",
          }),
        );

        fetchVehicles();
      }
      if (response?.data?.validationCode === "appointment.rejected") {
        dispatch(
          showSnackbar({
            message: "Appoitment Reject successfully",
            type: "success",
          }),
        );

        fetchVehicles();
      }

      setShowAssignRejectModal(false);
      setSelectedAptId(null);
    } catch (error) {
      console.error("Delete appointment failed", error);
    }
  };
  const fetchVehicles = async () => {
    let responseAppoitment;
    let responseMechanical;
    let responseAdmin;
    try {
      setLoading(true);
      if (userType === "customer") {
        responseAppoitment = await axiosInstance.get("/customer/appointments");
      } else if (userType === "mechanic") {
        responseMechanical = await axiosInstance.get("/mechanic/appointments");
      } else if (userType === "admin") {
        responseAdmin = await axiosInstance.get("/admin/appointments/list");
      }

      setAppoitmentList(
        responseAppoitment?.data?.entity ||
          responseMechanical?.data?.entity ||
          responseAdmin?.data?.entity?.appointmentList ||
          [],
      );
    } catch (error) {
      console.error("Error fetching vehicles", error);

      setAppoitmentList([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAppointment = async () => {
    if (!selectedAptId) return;

    try {
      const response = await axiosInstance.delete("/appointment", {
        params: {
          aptId: selectedAptId,
        },
      });
      console.log("response", response?.data?.validationCode);

      if (response?.data?.validationCode === "appointment.delete.success") {
        dispatch(
          showSnackbar({
            message: "Appoitment deleted  successfully",
            type: "success",
          }),
        );

        fetchVehicles();
      }
      setShowDeleteModal(false);
      setSelectedAptId(null);
    } catch (error) {
      console.error("Delete appointment failed", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) {
    return;
  }

  const linkVariable =
    "text-blue-600 text-sm font-medium hover:underline hover:text-blue-800 transition-colors";

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            {" "}
            Appointment List
          </h1>

          <VehicleButton
            text="Book Appointment"
            onClick={() =>
              navigate("checkVehicles", {
                state: { redirect: "fromAppoitment" },
              })
            }
          />
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Vehicle Number
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Appointment Date
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Problem
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Status
                  </th>
                  {userType === "admin" && (
                    <>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Approve/Reject
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Assigned Mechanic
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Assign Mechanic
                      </th>
                    </>
                  )}
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Created Date
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">
                    Delete
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Loading appointments...
                    </td>
                  </tr>
                )}

                {!loading &&
                  AppoitnmentList?.length > 0 &&
                  AppoitnmentList?.map((appoitmemt) => (
                    <tr
                      key={appoitmemt?.aptId}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {appoitmemt?.vehVehicleNumber ?? "N/A"}
                      </td>

                      <td className="px-3 py-2 text-gray-700">
                        {dayjs(appoitmemt?.aptDate).format("DD/MM/YYYY")}
                      </td>

                      <td className="px-3 py-2 text-gray-700">
                        {appoitmemt?.aptProblemDescription}
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          {appoitmemt?.aptStatus}
                        </span>
                      </td>
                      {userType === "admin" && (
                        <>
                          <td className="px-3 py-2">
                            <td className="px-3 py-2 text-center">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedAptId(appoitmemt?.aptId);
                                  setShowAssignRejectModal(true);
                                }}
                                className={linkVariable}
                              >
                                Link
                              </a>
                            </td>
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-center">
                            {appoitmemt?.aptMechanic || "-"}
                          </td>
                          <td className="px-3 py-2">
                            <td className="px-3 py-2 text-center">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedAptId(appoitmemt?.aptId);
                                }}
                                className={linkVariable}
                              >
                                Assign
                              </a>
                            </td>
                          </td>
                        </>
                      )}
                      <td className="px-3 py-2 text-gray-600">
                        {dayjs(appoitmemt?.aptCreated).format("DD/MM/YYYY")}
                      </td>

                      {/* DELETE */}
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedAptId(appoitmemt?.aptId);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-md bg-red-50 px-5 py-1.5
                             text-sm font-medium text-red-600
                             border border-red-200
                             hover:bg-red-100 hover:border-red-300
                             active:scale-95 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && AppoitnmentList?.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAptId(null);
        }}
        onConfirm={handleDeleteAppointment}
      />
      <ConfirmAssignRejectModal
        open={showAssignRejectModal}
        onClose={() => {
          setShowAssignRejectModal(false);
          setSelectedAptId(null);
        }}
        onConfirm={handleAssignReject}
      />
    </div>
  );
};

export default AppointmentList;
