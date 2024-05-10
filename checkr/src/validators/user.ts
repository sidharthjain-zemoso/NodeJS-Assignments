import { z } from "zod";
import { validateRequest } from "../middlewares/request-validator-middleware";

// Define your Zod schemas
const loginUserSchema = z.object({
    // email: z.string().email(),
    // password: z.string().min(6),
});

const signupUserSchema = z.object({
    // email: z.string().min(6).email().toLowerCase(),
    // password: z.string().min(6).max(255),
    // name: z.string().min(3).max(45),
});

const forgotPasswordSchema = z.object({
    // email: z.string().email(),
});

// Define your middleware using the validateRequest function
const userValidators = {
    loginUser: validateRequest(loginUserSchema),
    signupUser: validateRequest(signupUserSchema),
    forgotPassword: validateRequest(forgotPasswordSchema),
};

export default userValidators;
