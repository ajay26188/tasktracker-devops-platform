// /src/pages/auth/ResetPassword.tsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authServices/resetPassword";
import { Eye, EyeOff } from "lucide-react";
import FormLayout from "../../components/layouts/FormLayout";
import axios from "axios";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        dispatch(
            alertMessageHandler(
              { message: 'Password do not match', type: "error" },
              5
            )
          )
      return;
    }

    try {
      await resetPassword(token!, password, confirmPassword);
      navigate("/login"); // redirect to login after successful reset
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          dispatch(
            alertMessageHandler(
              { message: error.response.data.error, type: "error" },
              5
            )
          );
        }
      }
  };

  return (
    <FormLayout
      title="Reset Your Password"
      onSubmit={handleSubmit}
      fields={
        <>
          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your new password below to reset your account.
          </p>

          {/* Password field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm password field */}
          <div className="relative mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </>
      }
      actions={
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Reset Password
        </button>
      }
    />
  );
}
