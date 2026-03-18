// PersonalProfileModal.tsx

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updatePassword, deleteUser } from "../services/user";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { alertMessageHandler } from "../reducers/alertMessageReducer";
import AlertMessage from "../components/AlertMessage";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const PersonalProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const alertMessage = useSelector((state: RootState) => state.alertMessage);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      dispatch(
        alertMessageHandler({ message: "New asswords do not match", type: "error" }, 5)
      );
      return;
    };
    if (newPassword === oldPassword) {
        dispatch(
          alertMessageHandler({ message: "New password cannot be the same as the old password", type: "error" }, 5)
        );
        return;
    };
    try {
      await updatePassword(user.id, { oldPassword, newPassword });

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler({ message: error.response.data.error, type: "error" }, 5)
        );
      } else {
        dispatch(
          alertMessageHandler({ message: "Password change failed", type: "error" }, 5)
        );
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
        await deleteUser(user.id);
        navigate("/");
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          dispatch(
            alertMessageHandler({ message: error.response.data.error, type: "error" }, 5)
          );
        } else {
          dispatch(
            alertMessageHandler({ message: "Deleting account failed. Please try again", type: "error" }, 5)
          );
        }
      }
  };

  const handleClose = () => {
    // clear fields
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword(""); 
    onClose(); // close the modal
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow">
                {initials}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            {!showPasswordForm ? (
              <>
                <div className="space-y-2 text-gray-700 mb-6">
                  <p><span className="font-semibold">Role:</span> {user.role}</p>
                  <p><span className="font-semibold">Organization ID:</span> {user.organizationId}</p>
                </div>

                {alertMessage.message && <AlertMessage {...alertMessage} />}

                <div className="space-y-3">
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setDeleteUserId(user.id)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete My Account
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {alertMessage.message && <AlertMessage {...alertMessage} />}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordUpdate}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-transform duration-200 scale-95 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Delete Task</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PersonalProfileModal;
