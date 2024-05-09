import { ERROR_MESSAGES } from '../constants/controller-messages';
import { IBlog } from '../interfaces/blog-interface';
import { IUser } from '../interfaces/user-interface';
import Blog from '../models/blog';

const BlogService = {
    async addBlog (user: IUser, blogData: IBlog): Promise<IBlog> {
        try {
            const blog = await user.createBlog(blogData);
            return blog;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.FAILED_TO_CREATE_BLOG);
        }
    },

    async getBlogDataById (user: IUser, blogId: number): Promise<Blog | null> {
        try {
            const blog = await user.getBlog(blogId);
            return blog;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_BLOG);
        }
    },

    async getAllBlogs (user: IUser): Promise<Blog[]> {
        try {
            const blogs = await user.getBlogs();
            return blogs;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_BLOGS);
        }
    },

    async deleteBlogById (blogId: number): Promise<number> {
        try {
            const result = await Blog.destroy({ where: { id: blogId } });
            return result;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.FAILED_TO_DELETE_BLOG);
        }
    },

    async editBlog (blogId: number, blogData: IBlog) {
        try {
            const blog = await Blog.findByPk(blogId);
            if (blog) {
                if (blogData.title) blog.title = blogData.title;
                if (blogData.imageUrl) blog.imageUrl = blogData.imageUrl;
                if (blogData.content) blog.description = blogData.content;
                await blog.save();
                return blog;
            } else {
                throw new Error(ERROR_MESSAGES.BLOG_NOT_FOUND);
            }
        } catch (error) {
            throw new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_BLOG);
        }
    }
};

export default BlogService;
