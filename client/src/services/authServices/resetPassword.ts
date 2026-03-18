// /src/services/authServices/resetPassword.ts

import axios from "axios";
import { apiBaseUrl } from "../../constants";

// Request password reset (send reset email)
export const requestPasswordReset = async (email: string) => {
  const response = await axios.post(`${apiBaseUrl}/users/request-reset`, {email} );
  return response.data;
};

// Reset password with token
export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  const response = await axios.post(`${apiBaseUrl}/users/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};
