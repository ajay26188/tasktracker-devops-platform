// /reducers/notificationReducer.ts

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Notification } from "../types/notification";
import { fetchNotifications } from "../services/notification";
import type { AppDispatch } from "../store";

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationRead,
  markAllRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// Thunk to load notifications (typed)
export const loadNotifications =
  (page = 1, limit = 9) => async (dispatch: AppDispatch) => {
    const data = await fetchNotifications(page, limit);
    dispatch(setNotifications(data.notifications));
    return data;
};
