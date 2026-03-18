import axios from "axios";
import type { PaginatedTasks, Task, TaskPayload } from "../types/task";
import { apiBaseUrl } from "../constants";
import { authHeader } from "../utils/auth";

// Fetch all tasks for an organization with optional filters
export const fetchTasksByOrg = async (
  id: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  priority?: string,
  dueDate?: string
): Promise<PaginatedTasks> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (priority) params.append("priority", priority);
  if (dueDate) params.append("dueDate", dueDate);

  const res = await axios.get(`${apiBaseUrl}/tasks/org/${id}?${params.toString()}`, authHeader());
  return res.data;
};

// Fetch tasks assigned to the user with optional filters
export const fetchTasksByUser = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  priority?: string,
  dueDate?: string
): Promise<PaginatedTasks> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (priority) params.append("priority", priority);
  if (dueDate) params.append("dueDate", dueDate);

  const res = await axios.get(`${apiBaseUrl}/tasks/assigned?${params.toString()}`, authHeader());
  return res.data;
};

// Fetch single task
export const fetchTask = async (id: string): Promise<Task> => {
  const res = await axios.get(`${apiBaseUrl}/tasks/task/${id}`, authHeader());
  return res.data;
};

// Create task
export const createTask = async (data: Partial<TaskPayload>): Promise<Task> => {
  const res = await axios.post(`${apiBaseUrl}/tasks`, data, authHeader());
  return res.data;
};

// Update task
export const updateTask = async (id: string, data: Partial<TaskPayload>): Promise<Task> => {
  const res = await axios.patch(`${apiBaseUrl}/tasks/${id}`, data, authHeader());
  return res.data;
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${apiBaseUrl}/tasks/${id}`, authHeader());
};
