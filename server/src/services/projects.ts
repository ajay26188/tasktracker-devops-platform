// srs/services/projects.ts

import Project from "../models/project";
import Task from "../models/task";
import { newProjectData } from "../types/project";
import { ReturnedITask, Status } from "../types/task";
import { IUser } from "../types/user";
import { Document, Types } from "mongoose";

export const fetchProjectsByOrg = async(orgId: string) => {
    const projects = await Project.find({organizationId: orgId})
    .populate("tasks", "status");

    return projects;
};

export const addProject = async(data: newProjectData, authenticatedUser: (IUser & Document))  => {

    const orgId = authenticatedUser.organizationId;

    const creator = authenticatedUser._id;
    
    return await Project.create({
        ...data,
        organizationId: orgId,
        createdBy: creator
    });
};

export const removeProject = async(id: string, user: (IUser & Document)) => {
    const project = await Project.findById(id);

    if (!project) return null;

    if (project.organizationId.toString() !== user.organizationId.toString()) {
        return 'unauthorized';
    }

    //Deleting project and their tasks parallely
    await Promise.all([
        project.deleteOne(),
        Task.deleteMany({ projectId: new Types.ObjectId(id) }),
    ]);

    return 'deleted';
};

export const updateProject = async (projectId: string, updates: newProjectData, user: (IUser & Document)) => {
    const { name, description, startDate, endDate  } = updates;

    const project = await Project.findById(projectId);

    if (!project) return null;

    if (project.organizationId.toString() !== user.organizationId.toString()) {
        return 'unauthorized';
    }
  
    if (name) project.name = name;
    if (description) project.description = description;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
  
    return await project.save();
};

export const fetchProject = async (projectId: string, user: (IUser & Document)) => {
  const project = await Project.findById(projectId)
  .populate("createdBy", "name")
  .populate({
    path: "tasks",
    populate: [
      {
        path: "assignedTo",
        select: "name email",
      },
      {
        path: "projectId", // populate the project reference from task
        select: "name",   // only fetch project name
      },
    ],
  });

  
    if (!project) return null;
  
    if (project.organizationId._id.toString() !== user.organizationId.toString()) {
      return "unauthorized";
    }
  
    return project;
  };
  

// Fetch projects that the user is assigned to through tasks
export const fetchAssignedProjects = async (user: IUser & Document) => {
    const userId = user._id;
  
    // Find tasks assigned to the user
    const tasks = await Task.find({ assignedTo: userId });
  
    // Extract unique projectIds
    const projectIds = [...new Set(tasks.map((t) => t.projectId.toString()))];
  
    if (projectIds.length === 0) return [];
  
    // Fetch only those projects
    const projects = await Project.find({ _id: { $in: projectIds } })
    .populate("tasks", "status");
  
    return projects;
};
  
export const groupedTasks = async(projectId: string, user: (IUser & Document)) => {

    //Fetch project
  const project = await Project.findById(projectId);

  if (!project) return null;

  //Ensure project belongs to user's organization
  if (project.organizationId.toString() !== user.organizationId.toString()) {
    return 'forbidden';
  }
    
    // Fetch all tasks for this project
    const tasks = await Task.find({
        projectId
    })
    .select('status title description')
    .populate("assignedTo", "name");
      
    // Group tasks by status
    const grouped: {
        todo: ReturnedITask[];
        "in-progress": ReturnedITask[];
        done: ReturnedITask[];
      } = {
        todo: [],
        "in-progress": [],
        done: [],
      };
      

    for (const task of tasks) {
        if (task.status === Status.ToDo) grouped.todo.push(task);
        else if (task.status === Status.InProgress) grouped["in-progress"].push(task);

        else if (task.status === Status.Done) grouped.done.push(task);
    }

    return grouped;

};

