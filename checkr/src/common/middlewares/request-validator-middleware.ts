import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { z } from "zod";

export const validateQuery = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error: any) {
            console.error(error);
            res.status(httpStatus.BAD_REQUEST).json({ error: getErrorMessage(error) });
        }
    };
}

export const validatePath = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error: any) {
            console.error(error);
            res.status(httpStatus.BAD_REQUEST).json({ error: getErrorMessage(error) });
        }
    };
}

export const validateRequestBody = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            console.error(error);
            res.status(httpStatus.BAD_REQUEST).json({ error: getErrorMessage(error) });
        }
    };
};

const getErrorMessage = (error: any) => {
    return error.errors.map((err: any) => {
        return {field: err.path.map((path: string) => path).join("."), message: err.message};
    });
}