import express from "express";
import userController from "../controllers/user";
import userValidators from "../validators/user";
import { tryCatch } from "../utils/try-catch-wrapper";

const router = express.Router();

router.post("/login", userValidators.loginUser, tryCatch(userController.loginUser));

router.post("/signup", tryCatch(userController.signupUser));

router.post("/reset-password", tryCatch(userController.resetPassword));

router.post("/get-user-details", tryCatch(userController.getUserDataById));

export default router;