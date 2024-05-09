import { Request, Response, NextFunction } from "express";

interface IError extends Error{
    statusCode: number;
}

export const errorMiddleware = (err: IError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Something went wrong',
    });
}