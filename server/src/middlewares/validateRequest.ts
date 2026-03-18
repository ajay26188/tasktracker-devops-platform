// /src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from "express";
import { createOrganizationSchema } from "../schemas/organization";
import { createUserSchema, passwordResetSchema, updateRoleSchema, updatePasswordSchema } from "../schemas/user";
import { loginSchema } from "../schemas/login";
import { createProjectSchema } from "../schemas/project";
import { createTaskSchema, updateTaskSchema } from "../schemas/task";
import { createCommentSchema } from "../schemas/comment";

export const newOrganizationParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createOrganizationSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

export const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createUserSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

export const updatePasswordParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        updatePasswordSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

export const loginParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        loginSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const newProjectParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createProjectSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const newTaskParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createTaskSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const newCommentParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        createCommentSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const updateTaskParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        updateTaskSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const updateRoleParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        updateRoleSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const passwordResetParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        passwordResetSchema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};




