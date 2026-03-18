// /src/pages/auth/RequestReset.tsx

import { useState } from "react";
import { requestPasswordReset } from "../../services/authServices/resetPassword";
import { useDispatch } from "react-redux";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import type { AppDispatch } from "../../store";
import FormLayout from "../../components/layouts/FormLayout";
import axios from "axios";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      alert("A reset link has been sent to your email.");
    } catch (error: unknown) {
      let message = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.error || message;
      }
      dispatch(alertMessageHandler({ message, type: "error" }, 5));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title="Request Password Reset"
      onSubmit={handleSubmit}
      fields={
        <>
          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your email address and we will send you a link to reset your password.
          </p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
        </>
      }
      actions={
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      }
    />
  );
}
