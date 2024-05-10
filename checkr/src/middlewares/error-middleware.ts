import { Request, Response, NextFunction } from "express";
import { buildResponse } from "../utils/build-response";
import { ErrorMessages } from "../constants/messages";
import httpStatus from "http-status";
import { IError } from "../interfaces/error-interface";

export const errorMiddleware = (err: IError, req: Request, res: Response, next: NextFunction) => {
    return buildResponse(res, err.statusCode || httpStatus.INTERNAL_SERVER_ERROR, err.message || ErrorMessages.SOMETHING_WENT_WRONG, null);
}