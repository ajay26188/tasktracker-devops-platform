// /schema/comment.ts

import { z } from 'zod';

// Check if sent ObjectId is of correct type
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createCommentSchema = z.object({
    comment: z.string(),
    taskId: z.string().regex(objectIdRegex, 'Invalid taskId format.'),
});