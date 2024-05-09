import express from "express";
import blogValidators from "../validators/blog";
import blogController from "../controllers/blog";

const router = express.Router();

// /admin/products => GET
router.get("/", blogController.getBlogs);

// /admin/add-product => POST
router.post("/add" , blogValidators.validateBlogInput, blogController.addBlog);

router.delete("/delete", blogValidators.validateBlogIdQueryParam, blogController.deleteBlog);

// always put end points with params at last so that they don't conflict with similar end point without path param
// though above case might not occur in rest mostly
router.get("/:blogId/details", blogValidators.validateBlogIdPathParam, blogController.getBlogDataById);

router.put("/:blogId/edit", blogValidators.validateBlogIdPathParam, blogValidators.validateEditBlogInput, blogController.editBlog);

export default router;
