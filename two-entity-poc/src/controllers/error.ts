import { NextFunction, Request, Response } from "express";

export const get404 = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: '404 Not Found' });
};
