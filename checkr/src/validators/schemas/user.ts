import { z } from "zod";

// Define your Zod schemas
export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signupUserSchema = z.object({
    name: z.string().min(3).max(45),
    email: z.string().min(6).email().toLowerCase(),
    password: z.string().min(6).max(255),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const getUserByIdSchema = z.object({
    userId: z.coerce.number().min(1),
});