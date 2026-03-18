// utils/mailer.ts
import axios from "axios";

/**
 * Send email verification link to a user via Brevo API.
 * @param email - Recipient's email
 * @param token - JWT token to verify the email
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV;

  const link = `${baseUrl}/verify-email/${token}`;

  const payload = {
    sender: { name: "TaskTracker", email: process.env.EMAIL_FROM },
    to: [{ email }],
    subject: "Verify your TaskTracker account",
    htmlContent: `
      <h2>Welcome to TaskTracker 👋</h2>
      <p>Thanks for signing up. Please verify your email by clicking below:</p>
      <a href="${link}" style="background:#4f46e5;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
        Verify Email
      </a>
      <p>If you didn’t sign up, just ignore this email.</p>
    `,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY as string,
        "content-type": "application/json",
      },
    });
    console.log(`Verification email sent to ${email}`);
  } catch  {
    throw new Error("Email could not be sent");
  }
};

/**
 * Send password reset link to a user via Brevo API.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV;

  const link = `${baseUrl}/reset-password/${token}`;

  const payload = {
    sender: { name: "TaskTracker", email: process.env.EMAIL_FROM },
    to: [{ email }],
    subject: "Reset your TaskTracker password",
    htmlContent: `
      <h2>Password Reset Request 🔑</h2>
      <p>You requested to reset your TaskTracker password. Click below to continue:</p>
      <a href="${link}" style="background:#e11d48;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
        Reset Password
      </a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY as string,
        "content-type": "application/json",
      },
    });
    console.log(`Password reset email sent to ${email}`);
  } catch  {
    throw new Error("Email could not be sent");
  }
};
