import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../../services/authServices/login";
import axios from "axios";
import { useDispatch } from "react-redux";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import type { AppDispatch } from "../../store";
import { Eye, EyeOff } from "lucide-react";
import FormLayout from "../../components/layouts/FormLayout";
import { setUser } from "../../reducers/loggedUserReducer";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const user = await loginService.login({ email, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));

      //setting current user state to loggen in user
      dispatch(setUser(user));

      //On successful login, navigate to dashboard
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler({ message: error.response.data.error, type: "error" }, 5)
        );
      } else {
        dispatch(alertMessageHandler({ message: "Login failed. Please retry.", type: "error" }, 5));
      }
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <FormLayout
      title="Welcome Back"
      onSubmit={handleLogin}
      fields={
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </>
      }
      actions={
        <>
          <button
            type="submit"
            disabled={loggingIn}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              loggingIn
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loggingIn ? "Logging in..." : "Login"}
          </button>


          <p className="text-sm text-center text-gray-500 mt-2">
            Forgot your password?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/request-reset")}
            >
              Reset here
            </span>
          </p>
        </>
      }
    />

  );
};

export default Login;
