import { useEffect, useState } from "react";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import CommonPagination from "../../common/CommonPagination";
import useDebounce from "../../hooks/useDebounce";
import SearchInput from "../../common/SearchInput";
import dayjs from "dayjs";
import VehicleButton from "../../common/VehicleButton";
import { STATUS_LABEL, TITLE_OPTIONS } from "../../common/common";
import GenerateBillPopup from "./GenerateBillModal ";
import { showSnackbar } from "../../../store/snackbarSlice";
import { useAppDispatch } from "../../../store/hook";

/* =======================
   Interface
======================= */
interface Billing {
  vehId: number;
  vehVehicleNumber: string;
  vehVehicleType: string;
  vehModel: string;
  aptId: number;
  aptDate: string;
  aptStatus: string;
  aptCreated: string;
  custTitle: string;
  custFirstName: string;
  custSurname: string;
  mechanicTitle: string;
  mechanicFirstName: string;
  mechanicSurname: string;
}

/* =======================
   Component
======================= */
const BillingList = () => {
  const [data, setData] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openBillPopup, setOpenBillPopup] = useState(false);

  const MIN_LENGTH = 7;
  const MAX_LENGTH = 15;
  const isValidSearch =
    debouncedSearch.length >= MIN_LENGTH &&
    debouncedSearch.length <= MAX_LENGTH;

  const fetchBillings = async () => {
    setLoading(true);
    try {
      const params: any = {
        pageNumber: page,
      };
      if (isValidSearch) {
        params.vehicleNumber = debouncedSearch;
      } else if (
        debouncedSearch.length <= MIN_LENGTH &&
        debouncedSearch.length !== 0
      ) {
        return;
      }
      const response = await axiosInstance.get("finance/bill/list", {
        params,
      });

      const list = response?.data?.entity?.financeBillListRecordList || [];

      const count = response?.data?.entity?.financeBillListCount || 0;

      setData(list);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching billing list", error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (item: any) => {
    // STEP 1: Create order from backend
    const { data } = await axiosInstance.post(
      `/create-order?amount=${item?.bFinalTotal}`,
    );

    // STEP 2: Open Razorpay UI
    const options = {
      key: "rzp_test_SZUAHpgGTfucyr",
      amount: data?.entity?.amount,
      currency: "INR",
      order_id: data?.entity?.orderId,

      name: "Vehicle Service",
      description: "Service Payment",

      handler: async function (response: any) {
        const modifiedResponse = {
          ...response,
          payAptId: item?.aptId, // ✅ appointment id
          payAmount: item?.bFinalTotal, // ✅ amount
        };

        // STEP 3: Send response to backend
        await verifyPayment(modifiedResponse);
        await fetchBillings();
      },

      theme: {
        color: "#1976d2",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (response: any) => {
    await axiosInstance.post("/verify", response);
    dispatch(
      showSnackbar({
        message: "Payment Successfull",
        type: "success",
      }),
    );
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchBillings();
  }, [page, debouncedSearch, selectedRow]);

  /* =======================
     Helpers
  ======================= */
  const getFullName = (title: string, first: string, last: string) =>
    `${
      TITLE_OPTIONS.find((option) => option?.value === title)?.label ?? "-"
    } ${first || ""} ${last || ""}`;

  /* =======================
     UI
  ======================= */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Billing Management
          </h1>
          <p className="text-sm text-gray-500">
            Generate bills and manage payments
          </p>
        </div>

        {/* Search */}

        <div className="mb-4 flex flex-col gap-1">
          <SearchInput
            value={search}
            onChange={(value) => {
              if (value.length <= MAX_LENGTH) {
                setSearch(value.toUpperCase()); // 🔥 optional uppercase
              }
            }}
            placeholder="Search by vehicle number..."
          />

          {/* Min validation */}
          {search.length > 0 && search.length < MIN_LENGTH && (
            <span className="text-xs text-red-500">
              Enter at least {MIN_LENGTH} characters to search
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              {/* Header */}
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Vehicle No</th>
                  <th className="px-3 py-2 text-left">Vehicle Type</th>
                  <th className="px-3 py-2 text-left">Model</th>
                  <th className="px-3 py-2 text-left">Appoitment Date</th>
                  <th className="px-3 py-2 text-left">Created</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Mechanic</th>
                  <th className="px-3 py-2 text-left">Vehicle Owner</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading &&
                  data.map((item) => (
                    <tr
                      key={item.aptId}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {item.vehVehicleNumber}
                      </td>
                      <td className="px-3 py-2 text-gray-700 capitalize">
                        {item.vehVehicleType}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {item.vehModel}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {dayjs(item.aptDate).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {dayjs(item.aptCreated).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-3 py-2 font-semibold text-blue-600">
                        {STATUS_LABEL[item?.aptStatus] === "Ready for Delivery"
                          ? "Pending"
                          : "Paid"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {getFullName(
                          item.mechanicTitle,
                          item.mechanicFirstName,
                          item.mechanicSurname,
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {getFullName(
                          item.custTitle,
                          item.custFirstName,
                          item.custSurname,
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-center gap-2">
                          <VehicleButton
                            onClick={() => {
                              setSelectedRow(item);
                              setOpenBillPopup(true);
                            }}
                            text={item?.bId ? "View Bill" : "Generate Bill"}
                            className="!bg-white !text-blue-600 border border-blue-200 !py-1.5 !px-3 hover:!bg-blue-600 hover:!text-white transition-all shadow-sm !text-[11px] !font-bold"
                          />
                          <button
                            onClick={() => {
                              handlePayment(item);
                            }}
                            disabled={
                              !item?.bId || item?.aptStatus === "DELIVERED"
                            }
                            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors shadow-lg shadow-slate-200
    ${
      !item?.bId || item?.aptStatus === "DELIVERED"
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-slate-900 text-white hover:bg-blue-600"
    }`}
                          >
                            PAY
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && data.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <CommonPagination
            totalCount={totalCount}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
      <GenerateBillPopup
        open={openBillPopup}
        onClose={() => setOpenBillPopup(false)}
        selectedRow={selectedRow}
        fetchBillings={fetchBillings}
      />
    </div>
  );
};

export default BillingList;
