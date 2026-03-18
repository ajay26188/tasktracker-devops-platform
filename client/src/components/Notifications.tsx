import { useEffect, useState } from "react";
import { readNotification } from "../services/notification";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  loadNotifications,
  markNotificationRead,
  markAllRead,
} from "../reducers/notificationReducer";

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 9;

  // Redux notifications
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  // Fetch notifications when page/user changes
  useEffect(() => {
    if (user) {
      dispatch(loadNotifications(page, limit)).then((data) => {
        setPages(data.pages);
      });
    }
  }, [page, dispatch, user]);

  if (!notifications) {
    return <p className="p-3 text-sm text-gray-400">Loading...</p>;
  }

  // Mark single notification as read
  const handleRead = async (id: string) => {
    try {
      await readNotification(id, { isRead: true });
      dispatch(markNotificationRead(id));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id!);
      await Promise.all(unreadIds.map((id) => readNotification(id, { isRead: true })));
      dispatch(markAllRead());
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Date formatting
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="absolute right-12 mt-2 w-80 bg-white border shadow-xl rounded-xl overflow-hidden z-20">
      {/* Header */}
      <div className="p-3 font-semibold border-b bg-gray-50 flex justify-between items-center">
        <span className="text-gray-700">Notifications</span>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-indigo-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y">
        {notifications.length === 0 && (
          <p className="p-3 text-sm text-gray-400">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleRead(n.id!)}
            className={`flex items-start gap-3 p-3 cursor-pointer transition ${
              n.isRead ? "bg-white" : "bg-indigo-50"
            } hover:bg-gray-50`}
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                n.isRead ? "bg-gray-300" : "bg-indigo-500"
              }`}
            ></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(n.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {page < pages && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full text-center text-sm text-indigo-600 py-2 hover:bg-gray-50 font-medium"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

export default Notifications;
