import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupService from "../../services/authServices/signup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import type { AppDispatch } from "../../store";
import { Eye, EyeOff } from "lucide-react";
import FormLayout from "../../components/layouts/FormLayout";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      dispatch(
        alertMessageHandler(
          { message: "Passwords do not match", type: "error" },
          5
        )
      );
      return;
    }

    try {
      await signupService.signup({ name, email, password, organizationId });
      navigate("/verify-notice"); // Redirect to verify notice page
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
      title="Create Your Account"
      onSubmit={handleSignup}
      fields={
        <>
          <p className="text-gray-500 text-center text-sm mb-4">
            Sign up to join your organization and start tracking tasks.
          </p>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          {/* Password field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          {/* Confirm Password field */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
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

          {/* Organization ID input */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Don’t have an Organization ID? Ask your employer or{" "}
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() => navigate("/addOrg")}
              >
                create a new organization
              </span>.
            </p>
          </div>
        </>
      }
      actions={
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Sign Up
        </button>
      }
    />
  );
};

export default Signup;
