// /routes/comments.ts

import express, { Response, NextFunction }  from 'express';
import { AuthRequest, userExtractor } from '../middlewares/auth';
import { newCommentData } from '../types/comment';
import { newCommentParser } from '../middlewares/validateRequest';
import { addComment, fetchAllComments, removeComment } from '../services/comments';
import { isValidObjectId } from 'mongoose';
import { emitCommentAdded, emitCommentDeleted } from '..';

const router = express.Router();

// GET /api/comments?taskId=xxx – Fetch all comments for a task
router.get('/', userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.query ;

        if (!taskId || typeof taskId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid taskId' });
        }

        if (!isValidObjectId(taskId)) {
            return res.status(400).json({ error: 'Invalid taskId format' });
        }
        
        const result = await fetchAllComments(taskId, req.user!);
        
        if (!result) {
            return res.status(404).json({error: 'Task not found.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only view comments of tasks that belongs to your organization.'});
        }
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

// POST /api/comments
router.post('/', userExtractor, newCommentParser, async(req: AuthRequest<newCommentData>, res: Response, next: NextFunction) => {
    
    try {
        const result = await addComment(req.body, req.user!);

        if (!result) {
            return res.status(401).json({error: 'Task not found.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You are unauthorized to comment on this task.'});
        }

        // Notify all users in that task room
        emitCommentAdded(req.body.taskId.toString(), result);

        return res.status(201).json(result);

    } catch (error) {
        return next(error);
    }
});

// DELETE /api/comments/:id – Delete own comment
router.delete('/:id', userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await removeComment(req.params.id, req.user!);

        if (!result) {
            return res.status(404).json({error: 'Comment not found.'});
        }
        if (result === 'unauthorized') {
            return res.status(403).json({error: 'Unauthorized to perform this operation.'});
        }

        // Notify all users in the task room about the deleted comment
        emitCommentDeleted(result.taskId.toString(), result._id.toString());
        return res.status(204).end();
        
        
    } catch (error) {
        return next(error);
    }
});

export default router;