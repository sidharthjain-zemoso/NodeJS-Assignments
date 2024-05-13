import { NextFunction, Request, Response } from "express";

export const tryCatch = (cb: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cb(req, res, next);
        } catch (error: any) {
            next(error);
        }
    };
}