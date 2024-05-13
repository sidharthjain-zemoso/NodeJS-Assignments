import { Response } from "express";

export const buildResponse = (res: Response, status: number, message: string, data: any) => {
    return res.status(status).json({ message, data });
}