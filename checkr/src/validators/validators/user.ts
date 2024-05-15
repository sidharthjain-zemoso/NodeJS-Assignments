import { get } from "http";
import { validatePath, validateRequestBody } from "../../common/middlewares/request-validator-middleware";
import { forgotPasswordSchema, getUserDataByIdSchema, loginUserSchema, signupUserSchema } from "../schemas/user";

// Define your middleware using the validateRequest function
const userValidators = {
    loginUser: validateRequestBody(loginUserSchema),
    signupUser: validateRequestBody(signupUserSchema),
    resetPassword: validateRequestBody(forgotPasswordSchema),
    getUserDataById: validatePath(getUserDataByIdSchema),
};

export default userValidators;
