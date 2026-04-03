import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import ConfirmDeleteModal from "../../common/ConfirmDeleteModal";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";
import { TITLE_OPTIONS } from "../../common/common";
import CommonPagination from "../../common/CommonPagination";

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
  /* =======================
     Fetch Users
     ======================= */
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<UserListResponse>(
        "auth/user/list",
        {
          params: { pageNumber: page },
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
  }, [page]);

  /* =======================
     Helper
     ======================= */
  const capitalizeFirstLetter = (value?: string): string =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "-";

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Users List</h1>

          <VehicleButton
            text="Add User"
            onClick={() => navigate("/users/add")}
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Username</th>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">First Name</th>
                  <th className="px-3 py-2 text-left">Last Name</th>
                  <th className="px-3 py-2 text-center">Active/Deactive</th>
                  <th className="px-3 py-2 text-center">Edit</th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {loading && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                )}

                {/* Data */}
                {!loading &&
                  users?.length > 0 &&
                  users.map((user) => (
                    <tr
                      key={user?.useUsername}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 font-medium">
                        {user?.useUsername ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        {TITLE_OPTIONS.find(
                          (option) => option?.value === user?.useTitle,
                        )?.label ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        {capitalizeFirstLetter(user?.useFirstName)}
                      </td>
                      <td className="px-3 py-2">
                        {capitalizeFirstLetter(user?.useSurname)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {user?.useLoggedIn === 1 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 border border-green-300">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 border border-red-300">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            Offline
                          </span>
                        )}
                      </td>
                      {/* Edit */}
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            navigate("/users/add", {
                              state: { user },
                            });
                          }}
                          className="rounded-md bg-blue-50 px-4 py-1.5
                          text-sm text-blue-600 border border-blue-200
                          hover:bg-blue-100"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* Empty */}
                {!loading && users?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <CommonPagination
          totalCount={totalCount}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default UserList;
