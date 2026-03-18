import { useEffect, useState } from "react";
import { fetchUsers, updateRole, deleteUser } from "../services/user";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/user";
import { alertMessageHandler } from "../reducers/alertMessageReducer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import AlertMessage from "../components/AlertMessage";
import { FaTrash, FaUserShield, FaSearch } from "react-icons/fa";

const Users = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const alertMessage = useSelector((state: RootState) => state.alertMessage);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [search, setSearch] = useState(""); // search query

  useEffect(() => {
    if (user?.organizationId) {
      fetchUsers(user.organizationId)
        .then((data) => setUsers(data))
        .finally(() => setLoading(false));
    }
  }, [user?.organizationId]);

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-semibold">
          This page is only accessible to admins.
        </p>
      </div>
    );
  }

  const handleRoleChange = async (id: string, role: "admin" | "member") => {
    try {
      const newRole = role === "admin" ? "member" : "admin";
      const updated = await updateRole(id, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler(
            { message: error.response.data.error, type: "error" },
            5
          )
        );
      } else {
        dispatch(
          alertMessageHandler(
            { message: "Updating user failed. Please try again", type: "error" },
            5
          )
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteUserId(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler(
            { message: error.response.data.error, type: "error" },
            5
          )
        );
      } else {
        dispatch(
          alertMessageHandler(
            { message: "Deleting user failed. Please try again", type: "error" },
            5
          )
        );
      }
    }
  };

  if (loading)
  return (
    <div className="p-6 max-w-9xl mx-auto animate-pulse">
      {/* Heading Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>

      {/* Search Box Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-full max-w-md mb-6"></div>

      {/* Table Skeleton */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 w-full">
        <table className="w-full">
          <thead>
            <tr>
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <th
                    key={idx}
                    className="px-8 py-4 bg-gray-100 rounded text-left text-base font-bold text-gray-300"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {Array(5)
              .fill(0)
              .map((_, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {Array(5)
                    .fill(0)
                    .map((_, colIdx) => (
                      <td key={colIdx} className="px-8 py-5">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  // Sorting: first by first name, then by last name
  const sortedUsers = [...users].sort((a, b) => {
    const [aFirst, aLast] = a.name.split(" ");
    const [bFirst, bLast] = b.name.split(" ");
    if (aFirst.toLowerCase() < bFirst.toLowerCase()) return -1;
    if (aFirst.toLowerCase() > bFirst.toLowerCase()) return 1;
    return (aLast || "").localeCompare(bLast || "");
  });

  // Filtered users based on search
  const filteredUsers = sortedUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-9xl mx-auto">
      {alertMessage.message && <AlertMessage {...alertMessage} />}

      {/* Heading */}
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        👥 User Management
      </h1>

      {/* Search Box */}
      <div className="mb-6 relative max-w-md">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 w-full">
        <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-8 py-4 text-left text-base font-bold text-gray-700 uppercase tracking-wide">
                ID
                </th>
                <th className="px-8 py-4 text-left text-base font-bold text-gray-700 uppercase tracking-wide">
                Name
                </th>
                <th className="px-8 py-4 text-left text-base font-bold text-gray-700 uppercase tracking-wide">
                Email
                </th>
                <th className="px-8 py-4 text-left text-base font-bold text-gray-700 uppercase tracking-wide">
                Role
                </th>
                <th className="px-8 py-4 text-right text-base font-bold text-gray-700 uppercase tracking-wide">
                Actions
                </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((u, idx) => (
                <tr key={u.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-8 py-5 text-sm font-mono text-gray-600">{u.id}</td>
                <td className="px-8 py-5 text-lg font-semibold text-gray-900">
                    {u.name}
                </td>
                <td className="px-8 py-5 text-base text-gray-700">{u.email}</td>
                <td className="px-8 py-5 text-base">
                    <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                        u.role === "admin"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-300 text-gray-800"
                    }`}
                    >
                    {u.role}
                    </span>
                </td>
                <td className="px-8 py-5 text-right space-x-3">
                    <button
                    onClick={() => handleRoleChange(u.id, u.role)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-red-600 inline-flex items-center gap-1"

                    >
                    <FaUserShield /> Toggle Role
                    </button>
                    <button
                    onClick={() => setDeleteUserId(u.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 inline-flex items-center gap-1"

                    >
                    <FaTrash /> Delete
                    </button>
                </td>
                </tr>
            ))}
            {filteredUsers.length === 0 && (
                <tr>
                <td
                    colSpan={5}
                    className="px-8 py-8 text-center text-gray-500 text-lg"
                >
                    No users found.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>


      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-xl font-bold mb-3">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to permanently delete this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteUserId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
