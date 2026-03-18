// services/project.ts

import axios from "axios";
import { apiBaseUrl } from "../constants"; 
import { authHeader } from "../utils/auth";
import type { Comment } from "../types/comment";

// Fetch all comments 
export const fetchComments = async (taskId: string): Promise<Comment[]> => {
  const res = await axios.get(`${apiBaseUrl}/comments/?taskId=${taskId}`, authHeader());
  return res.data;
};

// Create a new comment
export const addComment = async (data: Comment): Promise<Comment> => {
  const res = await axios.post(`${apiBaseUrl}/comments`, data, authHeader());
  return res.data;
};
  
  // Delete a comment
export const deleteComment = async (id: string): Promise<void> => {
    await axios.delete(`${apiBaseUrl}/comments/${id}`, authHeader());
};
  


