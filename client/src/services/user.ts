import axios from "axios";
import { apiBaseUrl } from "../constants";
import { authHeader } from "../utils/auth";
import type { updatePasswordData, User } from "../types/user";

// Fetch all users belonging to an organization
export const fetchUsers = async (
  id: string,
  search?: string,
): Promise<User[]> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const res = await axios.get(`${apiBaseUrl}/users/${id}?${params.toString()}`, authHeader());
  return res.data;
};

// Update user's password
export const updatePassword = async (id: string, data: updatePasswordData) => {
  const res = await axios.patch(`${apiBaseUrl}/users/${id}`, data, authHeader());
  return res.data;
};

// Update user's role only possible by admin
export const updateRole = async (id: string, data: Partial<User>): Promise<User> => {
    const res = await axios.patch(`${apiBaseUrl}/users/${id}/role`, data, authHeader());
    return res.data;
  };

// Deleting all users possible by admin but normal users can only delete themselves
export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${apiBaseUrl}/users/${id}`, authHeader());
};


