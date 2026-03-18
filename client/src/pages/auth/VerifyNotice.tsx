import { useNavigate } from "react-router-dom";

const VerifyNotice = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-2xl font-bold">📧 Verify Your Email</h1>
      <p className="text-gray-600 max-w-md">
        We've sent a verification link to your email. Please check your inbox
        (and spam folder) to verify your account before logging in.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        Go to Login
      </button>
    </div>
  );
};

export default VerifyNotice;
