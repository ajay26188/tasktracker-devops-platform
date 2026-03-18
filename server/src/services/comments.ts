// /services/comments.ts

import { newCommentData } from "../types/comment";
import { IUser } from "../types/user";
import { Document } from "mongoose";
import Comment from "../models/comment";
import Task from "../models/task";
import Notification from "../models/notification";
import { emitNewNotification } from "..";

//fetch all comments for a task with req.query
export const fetchAllComments = async(taskId: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(taskId);

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    //fetching all comments in reverse chat-style newest first
    const comments = await Comment.find({ taskId })
    .populate("userId", "name")
    .sort({ createdAt: 1 }); // oldest -> newest 

    return comments;
};

// data contains 'comment' and 'taskId' fields..
export const addComment = async(data: newCommentData, authenticatedUser: (IUser & Document))  => {

    const task = await Task.findById(data.taskId);

    if (!task) return null;

    // Check first if the person commenting is the creator or assignee of the task
    const isCreator = task.createdBy.toString() === authenticatedUser.id;
    const isAssigned = task.assignedTo.some(
        id => id.toString() === authenticatedUser.id
    );

    if (!isCreator && !isAssigned) {
        return 'unauthorized';
    }

    const orgId = authenticatedUser.organizationId;

    const user = authenticatedUser._id;

    const savedComment =  await Comment.create({
        ...data,
        userId: user,
        organizationId: orgId,
    });

    // Notifications list to send
    const notifications: { message: string; userId: string }[] = [];

    task.assignedTo.forEach(uid => {
        if (uid.toString() !== authenticatedUser.id) {
          notifications.push({
            message: `A new message received in Task "${task.title}".`,
            userId: uid.toString()
          });
        }
      });   
      
      //Also notify admins
      notifications.push({
        message: `A new message received in Task "${task.title}".`,
        userId: task.createdBy.toString()
      });

    // Save + emit notifications
    for (const notif of notifications) {
        const savedNotification = await Notification.create(notif);
        emitNewNotification(notif.userId, savedNotification);
    }

    return savedComment;
};

export const removeComment = async(id: string, authenticatedUser: (IUser & Document)) => {
    const comment = await Comment.findById(id);

    if (!comment) return null;

    if (comment.userId.toString() !== authenticatedUser.id) {
        return 'unauthorized';
    }

    // Copy the comment object before deleting
    const deletedComment = comment.toObject();

    await comment.deleteOne();

    return deletedComment; // return the full comment object for emit event
};