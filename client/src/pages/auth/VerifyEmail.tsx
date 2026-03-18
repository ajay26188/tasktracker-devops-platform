import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import verifyService from "../../services/authServices/verifyEmail";
import type { VerifiedUser } from "../../types/signup";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [user, setUser] = useState<VerifiedUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) throw new Error("Missing token");
        const verifiedUser = await verifyService.verifyEmail(token);
        setUser(verifiedUser);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Verifying your email...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">❌ Invalid or expired verification link</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
      <h1 className="text-2xl font-bold">✅ Email Verified!</h1>
      {user && (
        <>
          <p className="text-lg">
            Welcome, <span className="font-semibold">{user.name}</span> 🎉
          </p>
          <p className="text-gray-600">
            Your email <span className="font-mono">{user.email}</span> has been verified.
          </p>
        </>
      )}
      <button
        onClick={() => navigate("/login")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
}
