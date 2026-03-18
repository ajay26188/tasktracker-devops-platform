// /schemas/task.ts

import { z } from 'zod';

// Check if sent ObjectId is of correct type
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    projectId: z.string().regex(objectIdRegex, 'Invalid projectId format.'),
    assignedTo: z.array(
        z.string().regex(objectIdRegex, "Invalid userId format.")
      ).optional(),
    priority: z.enum(['low','medium','high']),
    // this allows to send string dates from Postman or frontend (like "2025-08-01") and have them converted to Date objects automatically
    dueDate: z.string().transform(val => new Date(val)),
});

export const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    assignedTo: z.array(
        z.string().regex(objectIdRegex, "Invalid userId format.")
      ).optional(),      
    status: z.enum(['todo','in-progress','done']).optional(),
    priority: z.enum(['low','medium','high']).optional(),
    dueDate: z.string().transform(val => new Date(val)).optional(),
});
