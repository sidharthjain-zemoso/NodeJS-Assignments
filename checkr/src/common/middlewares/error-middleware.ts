import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import CustomError from "../interfaces/custom-error";
import { buildResponse } from "../../utils/build-response";
import { ErrorMessages } from "../constants/messages";

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return buildResponse(res, err.statusCode || httpStatus.INTERNAL_SERVER_ERROR, err.message || ErrorMessages.SOMETHING_WENT_WRONG, null);
}