import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { buildResponse } from "../utils/build-response";
import { SuccessMessages } from "../constants/messages";

const userController = {
    getUserDataById: async (req: Request, res: Response, next: NextFunction) => {
        // get user data by id
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("User Data"), null);
    },
    loginUser: async (req: Request, res: Response, next: NextFunction) => {
        // login user
        buildResponse(res, httpStatus.OK, SuccessMessages.loggedIn("User"), null);
    },
    signupUser: async (req: Request, res: Response, next: NextFunction) => {
        // signup user
        buildResponse(res, httpStatus.OK, SuccessMessages.signedUp("User"), null);
    },
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        // reset password
        buildResponse(res, httpStatus.OK, SuccessMessages.reset("Password"), null);
    },
    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        // get all users
        const data: any[] = []; // fetch using user service
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Users"), data);
    },
    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        // delete user
        buildResponse(res, httpStatus.OK, SuccessMessages.deleted("User"), null);
    },
}

export default userController;
