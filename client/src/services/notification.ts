import axios from "axios";
import { apiBaseUrl } from "../constants";
import type { Notification, PaginatedNotifications } from "../types/notification";
import { authHeader } from "../utils/auth";

export const fetchNotifications = async (
    page: number,
    limit: number,
  ): Promise<PaginatedNotifications> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
  
    const res = await axios.get(`${apiBaseUrl}/notifications?${params.toString()}`, authHeader());
    return res.data;
};

// Mark notification as read
export const readNotification = async (id: string, data: Partial<Notification>): Promise<Notification> => {
    const res = await axios.patch(`${apiBaseUrl}/notifications/${id}/read`, data, authHeader());
    return res.data;
  };