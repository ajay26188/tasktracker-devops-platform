import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI!;

export const PORT = process.env.PORT || 3000;

export const ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [];

export const SECRET = process.env.SECRET!;