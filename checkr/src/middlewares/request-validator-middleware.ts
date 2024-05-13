import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { z } from "zod";

export const validateRequest = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            console.error(error);
            res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    };
};