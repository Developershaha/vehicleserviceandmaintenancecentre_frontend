import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleButton from "../../common/VehicleButton";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import ConfirmDeleteModal from "../../common/ConfirmDeleteModal";
import { useAppDispatch } from "../../../store/hook";
import { showSnackbar } from "../../../store/snackbarSlice";

/* =======================
   User Type (API Contract)
   ======================= */
interface User {
  useUsername?: string;
  useTitle?: string;
  useFirstName?: string;
  useSurname?: string;
  useLoggedIn?: number; // 0 | 1
}

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /* =======================
     Fetch Users
     ======================= */
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ entity?: User[] }>(
        "auth/user/list",
      );

      setUsers(response?.data?.entity ?? []);
    } catch (error) {
      console.error("Error fetching users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =======================
     Delete User
     ======================= */
  const handleDelete = async (): Promise<void> => {
    if (!selectedUser?.useUsername) return;

    try {
      // 🔴 Replace with actual delete user API
      // await deleteUserApi(selectedUser.useUsername);

      dispatch(
        showSnackbar({
          message: "User deleted successfully",
          type: "success",
        }),
      );

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

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
                  <th className="px-3 py-2 text-center">Logged In</th>
                  <th className="px-3 py-2 text-center">Edit</th>
                  <th className="px-3 py-2 text-center">Delete</th>
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
                      <td className="px-3 py-2">{user?.useTitle ?? "-"}</td>
                      <td className="px-3 py-2">
                        {capitalizeFirstLetter(user?.useFirstName)}
                      </td>
                      <td className="px-3 py-2">
                        {capitalizeFirstLetter(user?.useSurname)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {user?.useLoggedIn === 1 ? "Yes" : "No"}
                      </td>

                      {/* Edit */}
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() =>
                            navigate("/users/add", {
                              state: { user },
                            })
                          }
                          className="rounded-md bg-blue-50 px-4 py-1.5
                          text-sm text-blue-600 border border-blue-200
                          hover:bg-blue-100"
                        >
                          Edit
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-md bg-red-50 px-4 py-1.5
                          text-sm text-red-600 border border-red-200
                          hover:bg-red-100"
                        >
                          Delete
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
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserList;
