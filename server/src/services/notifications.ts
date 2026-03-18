// /services/notifications.ts

import Notification from "../models/notification";
import { IUser } from "../types/user";
import { Document } from "mongoose";

//fetch all notifications for a user
export const fetchAllNotifications = async( authenticatedUser: (IUser & Document), page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments({userId: authenticatedUser.id});

    const notifications = await Notification.
    find({userId: authenticatedUser.id})
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    return {
        notifications,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
};

// marking notification as read
export const updateNotification = async( notificationId: string, authenticatedUser: (IUser & Document)) => {

    const notification = await Notification.findById(notificationId);

    if (!notification) return null;

    if (notification.userId.toString() !== authenticatedUser.id) {
        return 'unauthorized';
    }

    notification.isRead = true;

    await notification.save();

    return notification;
};