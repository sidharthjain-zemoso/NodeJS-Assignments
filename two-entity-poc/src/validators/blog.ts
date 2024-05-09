import { body } from "express-validator";
import { ERROR_MESSAGES } from "../constants/validation-messages";
import { handleValidationErrors } from "../middlewares/validation-error-handler";

const blogValidators = {
    validateBlogInput: [
        body("title").notEmpty().withMessage(ERROR_MESSAGES.getRequiredErrorMessage("title"))
            .isLength({ min: 5 }).withMessage(ERROR_MESSAGES.getMinStringErrorMessage("title", 5)),

        body("imageUrl").notEmpty().withMessage(ERROR_MESSAGES.getRequiredErrorMessage("imageUrl")),

        body("content").notEmpty().withMessage(ERROR_MESSAGES.getRequiredErrorMessage("content")),

        handleValidationErrors,
    ],

    validateEditBlogInput: [
        body("title").optional()
            .isString().withMessage(ERROR_MESSAGES.getDataTypeErrorMessage("title", "string"))
            .isLength({ max: 50 }).withMessage(ERROR_MESSAGES.getMaxStringErrorMessage("title", 50)),

        handleValidationErrors,
    ],

    validateBlogIdQueryParam: [
        body("blogId").custom((value, { req }) => {
            if (!req.query || !req.query.blogId) {
                throw new Error(ERROR_MESSAGES.getQeryParamErrorMessage("blogId"));
            }
            return true;
        }),

        handleValidationErrors,
    ],

    validateBlogIdPathParam: [
        body("blogId").custom((value, { req }) => {
            if (!req.params || !req.params.blogId) {
                throw new Error(ERROR_MESSAGES.getPathParamErrorMessage("blogId"));
            }
            return true;
        }),

        handleValidationErrors,
    ]
}

export default blogValidators;
