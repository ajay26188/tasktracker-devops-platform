// /routes/notifications.ts

import express, { NextFunction, Response } from "express";
import { AuthRequest, userExtractor } from "../middlewares/auth";
import { fetchAllNotifications, updateNotification } from "../services/notifications";

const router = express.Router();

// GET /api/notifications – List user’s notifications
router.get('/', userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
    try {
        const result = await fetchAllNotifications(req.user!, page, limit);
        
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

// PATCH /api/notifications/:id/read – Mark as read
router.patch('/:id/read', userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await updateNotification(req.params.id, req.user!);

        if (!result) {
            return res.status(404).json({error: 'Notification not found.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only view and modify your own notifications.'});
        }
        
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

export default router;