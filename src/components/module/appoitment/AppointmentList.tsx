import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import dayjs from "dayjs";
import ConfirmDeleteModal from "../../common/ConfirmDeleteModal";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";
import ConfirmAssignRejectModal from "../../common/ConfirmAssignRejectModal";
import AssignMechanicModal from "../../common/AssignMechanicModal";
/* ✅ MUI Icons */
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CommonPagination from "../../common/CommonPagination";
import { TITLE_OPTIONS } from "../../common/common";
const AppointmentList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [AppoitnmentList, setAppoitmentList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [jobCardCreatedId, setJobCardCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState<number | null>(null);
  const { userType } = useAppSelector((state) => state.auth);
  const [showAssignRejectModal, setShowAssignRejectModal] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [appointmentData, setAppointmentData] = useState({});
  const [expandedAptId, setExpandedAptId] = useState<number | null>(null);

  const handleAssignReject = async (action: "approve" | "reject") => {
    if (!selectedAptId) return;
    let response: any;
    try {
      if (action === "approve") {
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

  const handleMechanicAssign = async (mechanicName: string) => {
    const response = await axiosInstance.put(
      "/admin/appointments/assign",
      null,
      {
        params: {
          aptId: selectedAptId,
          username: mechanicName,
        },
      },
    );
    if (response?.data?.validationCode === "mechanic.assigned.success") {
      dispatch(
        showSnackbar({
          message: "Appoitment Reject successfully",
          type: "success",
        }),
      );
      setShowAssign(false);
      setSelectedAptId(null);
      fetchVehicles();
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
        responseAdmin = await axiosInstance.get("/admin/appointments/list", {
          params: { pageNumber: page },
        });
      }

      const entity =
        responseAppoitment?.data?.entity ||
        responseMechanical?.data?.entity ||
        responseAdmin?.data?.entity;
      if (userType === "admin") {
        setAppoitmentList(entity?.appointmentList || []);
        if (entity?.appointmentCount) {
          setTotalCount(entity?.appointmentCount);
        }
      } else {
        setAppoitmentList(entity || []);
      }
    } catch (error) {
      console.error("Error fetching appointments", error);
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
  }, [page]);

  if (loading) {
    return;
  }

  const linkVariable =
    "text-blue-600 text-sm font-medium hover:underline hover:text-blue-800 transition-colors";

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
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

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2 text-left">Vehicle Number</th>
                  <th className="px-3 py-2 text-left">Appointment Date</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Created Date</th>
                  {userType === "admin" && (
                    <>
                      <th className="px-3 py-2">Approve/Reject</th>
                      <th className="px-3 py-2">Assigned Mechanic</th>
                      <th className="px-3 py-2">Assign Mechanic</th>
                      <th className="px-3 py-2 text-center">Create Job Card</th>
                    </>
                  )}

                  {userType === "customer" && (
                    <th className="px-3 py-2">Assigned Mechanic</th>
                  )}
                  <th className="px-3 py-2 text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                {AppoitnmentList.map((appoitmemt) => {
                  const isExpanded = expandedAptId === appoitmemt?.aptId;
                  const isDisabled = Boolean(appoitmemt?.aptMechanic);

                  return (
                    <>
                      {/* MAIN ROW */}
                      <tr
                        key={appoitmemt?.aptId}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td
                          className="px-3 py-2 cursor-pointer text-center"
                          onClick={() =>
                            setExpandedAptId(
                              isExpanded ? null : appoitmemt?.aptId,
                            )
                          }
                        >
                          {isExpanded ? (
                            <KeyboardArrowDownIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowRightIcon fontSize="small" />
                          )}
                        </td>

                        <td className="px-3 py-2 font-medium text-gray-800">
                          {appoitmemt?.vehVehicleNumber ?? "N/A"}
                        </td>

                        <td className="px-3 py-2 text-gray-700">
                          {dayjs(appoitmemt?.aptDate).format("DD/MM/YYYY")}
                        </td>

                        <td className="px-3 py-2">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            {appoitmemt?.aptStatus}
                          </span>
                        </td>

                        <td className="px-3 py-2 text-gray-600">
                          {dayjs(appoitmemt?.aptCreated).format("DD/MM/YYYY")}
                        </td>

                        {userType === "admin" && (
                          <>
                            <td className="px-3 py-2">
                              <td className="px-3 py-2 text-center">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isDisabled) return;
                                    setAppointmentData(appoitmemt);
                                    setSelectedAptId(appoitmemt?.aptId);
                                    setShowAssignRejectModal(true);
                                  }}
                                  className={`${linkVariable} ${
                                    isDisabled
                                      ? "pointer-events-none cursor-not-allowed text-gray-400 no-underline"
                                      : ""
                                  }`}
                                  aria-disabled={isDisabled}
                                  title={
                                    isDisabled
                                      ? "Mechanic already assigned"
                                      : "Assign / Reject"
                                  }
                                >
                                  Link
                                </a>
                              </td>
                            </td>

                            <td className="px-3 py-2 text-center">
                              {appoitmemt?.aptMechanic
                                ? `${
                                    TITLE_OPTIONS.find(
                                      (option) =>
                                        option?.value ===
                                        appoitmemt?.mechanicTitle,
                                    )?.label ?? "-"
                                  } ${appoitmemt?.mechanicFirstName} ${appoitmemt?.mechanicSurname}`
                                : "-"}
                            </td>

                            <td className="px-3 py-2 text-center">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowAssign(true);
                                  setSelectedAptId(appoitmemt?.aptId);
                                }}
                                className={`${linkVariable} ${
                                  isDisabled ||
                                  appoitmemt?.aptStatus !== "APPROVED"
                                    ? "pointer-events-none text-gray-400"
                                    : ""
                                }`}
                              >
                                Assign
                              </a>
                            </td>

                            {!appoitmemt?.jcId ? (
                              <td className="px-3 py-2 text-center">
                                <button
                                  onClick={async () => {
                                    if (!appoitmemt?.aptId) return;
                                    setJobCardCreatedId(appoitmemt?.aptId);
                                    const response = await axiosInstance.post(
                                      "admin/job-cards",
                                      null,
                                      {
                                        params: {
                                          aptId: appoitmemt?.aptId,
                                        },
                                      },
                                    );

                                    if (
                                      response?.data?.validationCode ===
                                      "job.card.create.success"
                                    ) {
                                      dispatch(
                                        showSnackbar({
                                          message:
                                            "Customer job card created successfully",
                                          type: "success",
                                        }),
                                      );

                                      fetchVehicles();

                                      setShowDeleteModal(false);
                                      setSelectedAptId(null);
                                    }
                                  }}
                                  className={`inline-flex w-28 items-center justify-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium border transition-all ${jobCardCreatedId === appoitmemt?.aptId ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300"} active:scale-95`}
                                >
                                  {" "}
                                  Job Card
                                </button>
                              </td>
                            ) : (
                              <td className="px-3 py-2 text-center text-xl">
                                ✔
                              </td>
                            )}
                          </>
                        )}
                        {userType === "customer" && (
                          <td className="px-3 py-2 text-center">
                            {appoitmemt?.aptMechanic
                              ? `${
                                  TITLE_OPTIONS.find(
                                    (option) =>
                                      option?.value ===
                                      appoitmemt?.mechanicTitle,
                                  )?.label ?? "-"
                                } ${appoitmemt?.mechanicFirstName} ${appoitmemt?.mechanicSurname}`
                              : "-"}
                          </td>
                        )}
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

                      {/* EXPANDED ROW */}
                      {isExpanded && (
                        <tr className="bg-blue-50 border-b">
                          <td className="px-3 py-3"></td>
                          <td
                            className="px-3 py-3"
                            colSpan={userType === "admin" ? 9 : 5}
                          >
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Problem:</span>{" "}
                              {appoitmemt?.aptProblemDescription ||
                                "No problem description"}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
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
      <CommonPagination
        totalCount={totalCount}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
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
        appointmentData={appointmentData}
        onConfirm={handleAssignReject}
      />
      {showAssign && (
        <AssignMechanicModal
          onClose={() => {
            setShowAssign(false);
            setSelectedAptId(null);
          }}
          onConfirm={handleMechanicAssign}
        />
      )}
    </div>
  );
};

export default AppointmentList;
