import { Request, Response, NextFunction } from "express";
import { buildResponse } from "../utils/build-response";
import { ErrorMessages } from "../constants/messages";
import httpStatus from "http-status";
import CustomError from "../interfaces/custom-error";

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    return buildResponse(res, err.statusCode || httpStatus.INTERNAL_SERVER_ERROR, err.message || ErrorMessages.SOMETHING_WENT_WRONG, null);
}