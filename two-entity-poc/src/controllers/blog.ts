import { NextFunction, Request, Response } from "express";
import { IBlog } from "../interfaces/blog-interface";
import BlogService from "../services/blog";
import { IUser } from "../interfaces/user-interface";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/controller-messages";
import { getErrorObject } from "../util/generate-error";

const blogController = {

    addBlog: async (req: Request<{}, {}, { title: string; content: string; imageUrl: string; user: IUser }>, res: Response, next: NextFunction) => {
        try {
            const { title, imageUrl, content, user } = req.body;
            if (!user) {
                return res.status(401).json({ error: ERROR_MESSAGES.USER_NOT_AUTHENTICATED });
            }
            const blog: IBlog = { title, imageUrl, content };
            const createdBlog = await BlogService.addBlog(user, blog);
            res.status(201).json({ blog: createdBlog });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    getBlogDataById: async (req: Request<{ blogId: string }, {}, { user: IUser }>, res: Response, next: NextFunction) => {
        try {
            const blogId = parseInt(req.params.blogId);
            const blog = await BlogService.getBlogDataById(req.body.user!, blogId);
            if (blog) {
                res.status(200).json(blog);
            } else {
                throw getErrorObject(ERROR_MESSAGES.BLOG_NOT_FOUND, 404);
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    editBlog: async (req: Request<{ blogId: string }, {}, { title: string; imageUrl: string; content: string; user: IUser }>, res: Response, next: NextFunction) => {
        try {
            const blogId = +(req.params.blogId);
            const { title, imageUrl, content } = req.body;
            await BlogService.editBlog(blogId, { title, imageUrl, content });
            res.status(200).json({ message: SUCCESS_MESSAGES.SUCCESSFULLY_UPDATED_BLOG });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    getBlogs: async (req: Request<{}, {}, { user: IUser }>, res: Response, next: NextFunction) => {
        try {
            const blogs = await BlogService.getAllBlogs(req.body.user!);
            res.json(blogs);
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    deleteBlog: async (req: Request<{}, {}, { user: IUser }>, res: Response, next: NextFunction) => {
        try {
            const blogId = (req.query.blogId as string);
            const result = await BlogService.deleteBlogById(+blogId);
            res.status(200).json({ message: SUCCESS_MESSAGES.SUCCESSFULLY_DELETED_BLOG });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
}

export default blogController;
