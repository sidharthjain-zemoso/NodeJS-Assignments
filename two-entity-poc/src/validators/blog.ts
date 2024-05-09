import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ERROR_MESSAGES } from "../constants/validation-messages";

const blogValidators = {
    validateBlogInput: [
        body("title").notEmpty().withMessage(ERROR_MESSAGES.TITLE_REQUIRED)
            .isLength({ min: 5 }).withMessage(ERROR_MESSAGES.TITLE_MIN_LENGTH),

        body("imageUrl").notEmpty().withMessage(ERROR_MESSAGES.IMAGE_URL_REQUIRED),

        body("content").notEmpty().withMessage(ERROR_MESSAGES.CONTENT_REQUIRED),

        handleValidationErrors,
    ],

    validateEditBlogInput: [
        body("title").optional()
            .isString().withMessage(ERROR_MESSAGES.TITLE_STRING)
            .isLength({ max: 50 }).withMessage(ERROR_MESSAGES.TITLE_MAX_LENGTH),

        body("imageUrl").optional().notEmpty().withMessage(ERROR_MESSAGES.IMAGE_URL_REQUIRED),

        body("content").optional().notEmpty().withMessage(ERROR_MESSAGES.CONTENT_REQUIRED),

        handleValidationErrors,
    ],

    validateBlogIdQueryParam: [
        body("blogId").custom((value, { req }) => {
            if (!req.query || !req.query.blogId) {
                throw new Error(ERROR_MESSAGES.BLOG_ID_QUERY_PARAM_REQUIRED);
            }
            return true;
        }),

        handleValidationErrors,
    ],

    validateBlogIdPathParam: [
        body("blogId").custom((value, { req }) => {
            if (!req.params || !req.params.blogId) {
                throw new Error(ERROR_MESSAGES.BLOG_ID_PATH_PARAM_REQUIRED);
            }
            return true;
        }),

        handleValidationErrors,
    ]
}

function handleValidationErrors (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
}

export default blogValidators;
