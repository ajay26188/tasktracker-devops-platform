// /routes/organizations.ts

import express, {Request, Response, NextFunction} from 'express';

const router = express.Router();

import { IOrganization, ReturnedIOrganization } from '../types/organization';
import { newOrganizationParser } from '../middlewares/validateRequest';
import { addOrganization, getOrganization, removeOrganization, updateOrganization } from '../services/organizations';
import { adminStatus, AuthRequest, userExtractor } from '../middlewares/auth';

//fetching an organization based on their id
router.get('/:id', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await getOrganization(req.params.id, req.user!);

        if (!result) {
            return res.status(404).json({error: 'Invalid organization ID.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You only only view your own organization details.'});
        }

        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

//POST /api/organization
router.post('/', newOrganizationParser, async(req: Request<unknown, unknown, IOrganization>, res: Response<ReturnedIOrganization>) => {
    const newOrg = await addOrganization(req.body);
    res.status(201).json(newOrg);
});

// Deleting an organization only possible by the admin and admins can delete only respective organization
router.delete('/:id', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await removeOrganization(req.params.id, req.user!);

        if (!result) {
            return res.status(404).json({error: 'Organization not found.'});
        }
        if (result === 'unauthorized') {
            return res.status(403).json({error: 'Unauthorized to perform this operation.'});
        }
        if (result === 'deleted') {
            return res.status(204).end();
        }
        
    } catch (error) {
        return next(error);
    }
});

//updating organization's info 
router.put('/:id', adminStatus, userExtractor, newOrganizationParser, async(req: AuthRequest<IOrganization>, res: Response, next: NextFunction) => {
    try {
        const result = await updateOrganization(req.params.id, req.body, req.user!);

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only update your own organization information.'});
        }

        if (!result) {
            return res.status(404).json({error: 'Invalid organization.'});
        }
        return res.json(result);
        
        } catch (error) {
        return next(error);
    }
});

export default router;