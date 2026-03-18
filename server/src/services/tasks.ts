import Project from "../models/project";
import Task from "../models/task";
import User from "../models/user";
import { ITask, newTaskData, Priority, Status, updateTaskData } from "../types/task";
import { IUser, Role } from "../types/user";
import mongoose, { Document, FilterQuery, Types } from "mongoose";
import Comment from '../models/comment';
import Notification from "../models/notification";
import { emitNewNotification, emitTaskStatusUpdate } from "..";

export const fetchTasksByOrg = async (
    orgId: string,
    user: IUser & Document,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: Status,
    priority?: Priority,
    dueDate?: string // "past7", "past30", "today", "next7", "next30"
  ) => {
    if (user.organizationId.toString() !== orgId) {
      return "unauthorized";
    }
  
    const query: FilterQuery<ITask> = { organizationId: orgId };
  
    // Search by title or _id
    if (search) {
      const conditions: { title?: { $regex: string; $options: string }; _id?: mongoose.Types.ObjectId }[] = [
          { title: { $regex: search, $options: "i" } }
      ];
  
      // If search looks like a valid ObjectId, also search by _id
      if (mongoose.Types.ObjectId.isValid(search)) {
          conditions.push({ _id: new mongoose.Types.ObjectId(search) });
      }
  
      query.$or = conditions;
    }
  
    // Filter by status
    if (status && status !== Status.All) {
      query.status = status;
    }
  
    // Filter by priority
    if (priority && priority !== Priority.All) {
      query.priority = priority;
    }
  
    // Filter by due date
    if (dueDate && dueDate !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
      
        switch (dueDate) {
          case "today":
            query.dueDate = today;
            break;
          case "past7":
            fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            toDate = today;
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
          case "past30":
            fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            toDate = today;
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
          case "next7":
            fromDate = today;
            toDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
          case "next30":
            fromDate = today;
            toDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
        }
      }
      
  
    const skip = (page - 1) * limit;
  
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("assignedTo", "name email")
        .populate("projectId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);
  
    return {
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
};

// Fetch tasks that the user is assigned to with pagination
export const fetchAssignedTasks = async (
    user: IUser & Document,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: Status,
    priority?: Priority,
    dueDate?: string
  ) => {
    const userId = user._id;
  
    const query: FilterQuery<ITask> = { assignedTo: { $in: [userId] } };
  
    // Search by title or _id
    if (search) {
      const conditions: { title?: { $regex: string; $options: string }; _id?: mongoose.Types.ObjectId }[] = [
          { title: { $regex: search, $options: "i" } }
      ];
  
      // If search looks like a valid ObjectId, also search by _id
      if (mongoose.Types.ObjectId.isValid(search)) {
          conditions.push({ _id: new mongoose.Types.ObjectId(search) });
      }
  
      query.$or = conditions;
    }

    if (status && status !== Status.All) query.status = status;
    if (priority && priority !== Priority.All) query.priority = priority;
  
    if (dueDate && dueDate !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
      
        switch (dueDate) {
          case "today":
            query.dueDate = today;
            break;
          case "past7":
            fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            toDate = today;
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
          case "past30":
            fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            toDate = today;
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
          case "next7":
            fromDate = today;
            toDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
          case "next30":
            fromDate = today;
            toDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            query.dueDate = { $gte: fromDate, $lte: toDate };
            break;
        }
      }
      
  
    const skip = (page - 1) * limit;
  
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("assignedTo", "name email")
        .populate("projectId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);
  
    return {
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
};
  
//Fetching a single task 
export const fetchSingleTask = async(taskId: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(taskId).populate("assignedTo", "name email").populate("projectId", "name");

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    return task;
};

export const addTask = async(authenticatedUser: (IUser & Document), data: newTaskData) => {
    const project = await Project.findById(data.projectId);

    //console.log('project found!');

    if (!project) return null;

    if (data.assignedTo && data.assignedTo.length > 0) {
        const users = await User.find({ _id: { $in: data.assignedTo } });
    
        if (users.length !== data.assignedTo.length) return null; // invalid user(s)
    
        for (const user of users) {
            if (user.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
                return 'unauthorized';
            }
        }
    }
    

    if (project.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    const orgId = authenticatedUser.organizationId;

    const creator = authenticatedUser._id;

    const newTask = await Task.create({
        ...data,
        organizationId: orgId,
        createdBy: creator
    });

    if (data.assignedTo) {
        // Notify each assigned user
        for (const userId of data.assignedTo) {
            const message = `A task titled ${data.title} has been assigned to you.`;
    
            const savedNotification = await Notification.create({
                message,
                userId
            });
    
            emitNewNotification(userId.toString(), savedNotification);
        }
    }

    await Project.findByIdAndUpdate(data.projectId, {
        $push: {tasks: newTask._id}
    });

    return newTask;
};

export const updateTask = async (user: (IUser & Document), updates: updateTaskData, taskId: string) => {
  const task = await Task.findById(taskId);

  if (!task) return null;

  if (user.organizationId.toString() !== task.organizationId.toString()) {
      return 'unauthorized';
  }

  const { title, description, assignedTo, status, priority, dueDate } = updates;

  // If user is not admin but tries to update admin-only fields → reject early
  if (user.role !== Role.Admin && (title || description || assignedTo || priority || dueDate)) {
      return 'forbidden'; 
  }

  // Notifications list to send
  const notifications: { message: string; userId: string }[] = [];

  if (user.role === Role.Admin) {

      if (title) {
          const oldTitle = task.title; // store old title
          task.title = title;
      
          task.assignedTo.forEach(uid => {
              notifications.push({
                message: `Task "${oldTitle}" has been renamed to "${title}".`,
                userId: uid.toString()
              });
          });
      }
       

      if (description) {
          task.description = description;
          task.assignedTo.forEach(uid => {
              notifications.push({
                message: `Task ${task.title} description has been updated.`,
                userId: uid.toString()
              });
          });
      };
      
      if (Array.isArray(assignedTo)) {
        // validate all new assignees first
        for (const userId of assignedTo) {
          const assignedToUser = await User.findById(userId);
          if (!assignedToUser) continue;
      
          if (assignedToUser.organizationId.toString() !== user.organizationId.toString()) {
            return 'unauthorized';
          }
        }
      
        const oldAssignees = task.assignedTo.map(uid => uid.toString());
        const newAssignees = assignedTo.map(uid => uid.toString());
      
        // Find differences
        const added = newAssignees.filter(uid => !oldAssignees.includes(uid));
        const removed = oldAssignees.filter(uid => !newAssignees.includes(uid));
      
        // Update task
        task.assignedTo = assignedTo;
      
        // Notify added users
        added.forEach(uid => {
          notifications.push({
            message: `You have been assigned to task "${task.title}".`,
            userId: uid,
          });
        });
      
        // Notify removed users
        removed.forEach(uid => {
          notifications.push({
            message: `You have been removed from task "${task.title}".`,
            userId: uid,
          });
        });
      
        // Notify everyone else that the assignees list changed
        newAssignees.forEach(uid => {
          if (!added.includes(uid)) {
            notifications.push({
              message: `Task "${task.title}" assignees have been updated.`,
              userId: uid,
            });
          }
        });
      }
      
      if (priority) {
          task.priority = priority;
          task.assignedTo.forEach(uid => {
            notifications.push({
              message: `Task "${task.title}" priority changed to ${priority}.`,
              userId: uid.toString()
            });
          });
      };
      
      if (dueDate) {
          const parsedDate = new Date(dueDate); // Ensure it's a Date object
          task.dueDate = parsedDate;
        
          task.assignedTo.forEach(uid => {
            notifications.push({
              message: `Task "${task.title}" due date changed to ${parsedDate.toDateString()}.`,
              userId: uid.toString()
            });
          });
        }
        

  }

  let statusChanged = false;

  if (task.assignedTo.some(uid => String(uid) === String(user.id)) || user.role === Role.Admin) {

      if (status) {
          task.status = status;
          statusChanged = true;

          task.assignedTo.forEach(uid => {
              if (uid.toString() !== user.id) {
                  notifications.push({
                      message: `Task "${task.title}" status changed to ${status}.`,
                      userId: uid.toString()
                  });
              }
          });
          if (user.role !== Role.Admin) {
              notifications.push({
                  message: `Task "${task.title}" status changed to ${status}.`,
                  userId: task.createdBy.toString()
              });
          }
      }
  } else {
    return 'not allowed';
  }
  
  await task.save();

  // Save + emit notifications
  for (const notif of notifications) {
      const savedNotification = await Notification.create(notif);
      emitNewNotification(notif.userId, savedNotification);
  }

  //Return populated task
  const populatedTask = await task.populate("assignedTo", "name email");

  // Emit only if status was changed for kanban board
  if (statusChanged) {
    emitTaskStatusUpdate(task.projectId.toString(), task);
  }
  
  return populatedTask;
};

export const removeTask = async(id: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(id);

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    //Remove task from project before deletion
    await Project.updateOne(
        { _id: task.projectId },
        { $pull: { tasks: task._id} }
    );

    //Deleting task and their comments parallely
    await Promise.all([
        task.deleteOne(),
        Comment.deleteMany({ taskId: new Types.ObjectId(id) }),
    ]);

    return 'deleted';
};

