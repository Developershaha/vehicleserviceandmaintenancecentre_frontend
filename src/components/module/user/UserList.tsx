import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import { TITLE_OPTIONS } from "../../common/common";
import CommonPagination from "../../common/CommonPagination";
import useDebounce from "../../hooks/useDebounce";
import SearchInput from "../../common/SearchInput";

export interface User {
  useUsername: string;
  useTitle?: string;
  useFirstName: string;
  useSurname: string;
  useLoggedIn: 0 | 1 | null;
}

export interface UserListResponse {
  entity: {
    userList: User[];
    userListCount: number;
  };
  validationCode: string;
}

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // 🔥 NEW: Search state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  /* =======================
     Debounce Logic
     ======================= */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* =======================
     Fetch Users
     ======================= */
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const resdata = await axiosInstance.get("finance/bill/list");
      console.log("res", resdata);
      const response = await axiosInstance.get<UserListResponse>(
        "auth/user/list",
        {
          params: {
            pageNumber: page,
            useUsername: debouncedSearch || undefined, // 🔥 search param
          },
        },
      );

      setUsers(response.data.entity.userList);
      if (response.data.entity.userListCount)
        setTotalCount(response.data.entity.userListCount);
    } catch (error) {
      console.error("Error fetching users", error);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  /* =======================
     Helper
     ======================= */
  const capitalizeFirstLetter = (value?: string): string =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "-";
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* 🔥 Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500">
              Manage all system users here
            </p>
          </div>

          <VehicleButton
            text="+ Add User"
            onClick={() => navigate("/users/add")}
          />
        </div>

        <div className="mb-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by username..."
          />
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-md border">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              {/* Header */}
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    First Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Last Name
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                )}

                {!loading &&
                  users?.map((user, index) => (
                    <tr
                      key={user.useUsername}
                      className={`border-t transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {user.useUsername}
                      </td>

                      <td className="px-4 py-3">
                        {
                          TITLE_OPTIONS.find((t) => t.value === user.useTitle)
                            ?.label
                        }
                      </td>

                      <td className="px-4 py-3">
                        {capitalizeFirstLetter(user.useFirstName)}
                      </td>

                      <td className="px-4 py-3">
                        {capitalizeFirstLetter(user.useSurname)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        {user.useLoggedIn === 1 ? (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            🟢 Online
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                            🔴 Offline
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            navigate("/users/add", { state: { user } })
                          }
                          className="px-4 py-1.5 text-sm rounded-lg
                                   bg-blue-600 text-white
                                   hover:bg-blue-700 transition shadow-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <CommonPagination
            totalCount={totalCount}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};
export default UserList;
