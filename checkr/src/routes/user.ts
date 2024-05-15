import express from "express";
import userController from "../controllers/user";
import userValidators from "../validators/validators/user";
import { tryCatch } from "../utils/try-catch-wrapper";
import isAuth from "../common/middlewares/auth";

const router = express.Router();

router.post("/login", userValidators.loginUser, tryCatch(userController.loginUser));

router.post("/signup", userValidators.signupUser, tryCatch(userController.signupUser));

router.post("/reset-password", userValidators.resetPassword, tryCatch(userController.resetPassword));

router.post("/get-user-details/:userId", userValidators.getUserDataById, isAuth, tryCatch(userController.getUserDataById));

export default router;