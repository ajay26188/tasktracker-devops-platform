// / schema/login.ts

import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email("Invalid email format."),
    password: z.string()
    .min(6, "Password must be at least 6 characters!")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
      message: "Password must contain uppercase, lowercase, and number",
    }),
});