// services/project.ts

import axios from "axios";
import type { Project } from "../types/project";
import { apiBaseUrl } from "../constants"; 
import { authHeader } from "../utils/auth";
import type { groupedTasks } from "../types/task";

// Fetch all projects for organization (admin)
export const fetchProjectsByOrg = async (orgId: string): Promise<Project[]> => {
  const res = await axios.get(`${apiBaseUrl}/projects/org/${orgId}`, authHeader());
  return res.data;
};

// Fetch projects assigned to user (member)
export const fetchAssignedProjects = async (): Promise<Project[]> => {
  const res = await axios.get(`${apiBaseUrl}/projects/assigned`, authHeader());
  return res.data;
};

// Create a new project
export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await axios.post(`${apiBaseUrl}/projects`, data, authHeader());
  return res.data;
};

// Fetch single project by id
export const fetchProject = async (id: string): Promise<Project> => {
    const res = await axios.get(`${apiBaseUrl}/projects/project/${id}`, authHeader());
    return res.data;
};
  
  // Update project
  export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await axios.put(`${apiBaseUrl}/projects/${id}`, data, authHeader());
    return res.data;
  };
  
  // Delete project
  export const deleteProject = async (id: string): Promise<void> => {
    await axios.delete(`${apiBaseUrl}/projects/${id}`, authHeader());
};

// Fetching tasks grouped by status (todo, in-progress, done) for a given project
//'id' is project's id
// kanband board view
export const groupedTasksByProject = async (id: string): Promise<groupedTasks> => {
  const res = await axios.get(`${apiBaseUrl}/projects/${id}/kanban`, authHeader());
  return res.data;
};
  


