import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../interfaces/custom-error";
import { User } from "../../models/user";
import { AUTH_SECRET } from "../constants/global";
import { ErrorMessages } from "../constants/messages";
import httpStatus from "http-status";

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            throw new CustomError(ErrorMessages.NOT_AUTHENTICATED, httpStatus.UNAUTHORIZED);
        }
        const token = authHeader.split(" ")[1];
        // decodedToken will now contain everything that was passed in the payload while creating the token using jwt.sign()
        const decodedToken = jwt.verify(token, AUTH_SECRET) as jwt.JwtPayload;
        if (!decodedToken) {
            throw new CustomError(ErrorMessages.NOT_AUTHENTICATED, httpStatus.UNAUTHORIZED);
        }
        console.log("Decoded token:", decodedToken);
        req.body.user = await User.findByPk(decodedToken.userId);
        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
           next(new CustomError(ErrorMessages.NOT_AUTHENTICATED, httpStatus.UNAUTHORIZED));
        } else {
            next(err);
        }
    }
};

export default isAuth;
