import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { SECRET } from "../config/env";
import User from "../models/user";
import { IUser } from "../types/user";
import { Document } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AuthRequest<T = any> extends Request {
    token?: string | null,
    user?: (IUser & Document) | null,
    body: T
};

interface DecodedToken {
    id: string,
    role: string,
    organizationId: string
};

export const tokenExtractor = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
    } else {
        req.token = null;
    }
    next();
};

export const adminStatus = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({error:'token missing.' });
    }

    const decoded = jwt.verify(token, SECRET); 

    if (typeof decoded !== 'object' || decoded === null || !('role' in decoded)) {
        return res.status(401).json({error: 'Invalid token.'});
    }

    const decodedToken = decoded as DecodedToken; // type guard

    if (decodedToken.role !== 'admin') {
        return res.status(403).json({error: 'Forbidden to perform this operation.'});
    }
    return next(); //returns to routeHandler if the user is admin
};

export const userExtractor = async( req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({error:'token missing.' });
    }

    const decoded = jwt.verify(token, SECRET); 

    if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
        return res.status(401).json({error: 'Invalid token.'});
    }

    const decodedToken = decoded as DecodedToken; // type guard

    try {
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({error: 'User not found.'});
        }

        req.user = user;
        return next();

    } catch (err) {
        return next(err);
    }
};