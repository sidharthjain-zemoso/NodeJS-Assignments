import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { buildResponse } from "../utils/build-response";
import { SuccessMessages } from "../common/constants/messages";
import UserService from "../services/user";
import { IUser } from "../common/interfaces/user";

const userController = {
    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        // get user data by id
        const data = await UserService.getUserById(req.body.user);
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("User Data"), data);
    },
    loginUser: async (req: Request, res: Response, next: NextFunction) => {
        // login user
        const data = await UserService.loginUser(req.body.email, req.body.password);
        buildResponse(res, httpStatus.OK, SuccessMessages.loggedIn("User"), data);
    },
    signupUser: async (req: Request, res: Response, next: NextFunction) => {
        // signup user
        const { name, email, password } = req.body;
        const user: IUser = { name, email, password };
        const data = await UserService.signupUser(user);
        buildResponse(res, httpStatus.OK, SuccessMessages.signedUp("User"), data);
    },
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        // reset password
        buildResponse(res, httpStatus.OK, SuccessMessages.reset("Password"), null);
    },
}

export default userController;
