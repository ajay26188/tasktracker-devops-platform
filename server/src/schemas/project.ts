// /schemas/project.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(100, { message: 'Name must be at most 100 characters long.' }),
  description: z
    .string()
    .min(1, { message: 'Description is required.' })
    .max(1000, { message: 'Description must be at most 1000 characters long.' }),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
});
