// /types/task.ts

import { Types } from 'mongoose';

export enum Status {
    All = "all",
    ToDo = "todo",
    InProgress = "in-progress",
    Done = "done"
};

export enum Priority {
    All = "all",
    Low = "low",
    Medium = "medium",
    High = "high"
}

export interface ITask {
    title: string, 
    description: string,
    projectId: Types.ObjectId,
    organizationId: Types.ObjectId,
    createdBy: Types.ObjectId,
    assignedTo: Types.ObjectId[],
    status: Status,
    priority: Priority,
    dueDate: Date,
};

export interface updateTaskData {
    title?: string, 
    description?: string,
    assignedTo?: Types.ObjectId[],
    status?: Status,
    priority?: Priority,
    dueDate?: Date, 
};

export interface ReturnedITask {
    _id?: Types.ObjectId,
    __v?: number, // operand of 'delete' operator must be optional
    id?: string,
    title: string, 
    description: string,
    projectId: Types.ObjectId,
    organizationId: Types.ObjectId,
    createdBy: Types.ObjectId,
    assignedTo: Types.ObjectId[],
    status: Status,
    priority: Priority,
    dueDate: Date,
    createdAt?: Date,
    updatedAt?: Date,
};

export type newTaskData = Omit<ITask, 'createdBy' | 'organizationId' >;
  

// Mongo filter object (correct types for DB)
export interface TaskFilter {
    projectId?: Types.ObjectId;
    status?: string;
    priority?: string;
    assignedTo?: Types.ObjectId;
    dueDate?: { $lte: Date }; //setting before or after date
}


