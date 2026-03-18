// /schemas/user.ts

import { z } from 'zod';

// Check if sent ObjectId is of correct type
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createUserSchema = z.object({
    name: z.string(),
    email: z.email('Invalid email format.'),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include uppercase, lowercase, number'
        ),
    organizationId: z.string().regex(objectIdRegex, 'Invalid organizationId format.'),
});

export const updatePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower, number'
        ),
    newPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower, number'
        ),
});

export const updateRoleSchema = z.object({
    role: z.enum(['admin', 'member'])
});

export const passwordResetSchema = z.object({
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower, number'
        ),
});