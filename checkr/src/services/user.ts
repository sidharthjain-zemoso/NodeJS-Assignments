import { User } from "../models/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomError from "../common/interfaces/custom-error";
import { IUser } from "../common/interfaces/user";
import { AUTH_SECRET, AUTH_TOKEN_EXPIRY } from "../common/constants/global";
import { ErrorMessages } from "../common/constants/messages";
import httpStatus from "http-status";
import { ILoginUserResponse, IUserService } from "../interfaces/user-service";

const UserService: IUserService = {
    async getUserById(userId: number) {
        return await User.findByPk(userId);
    },

    async signupUser (user: IUser) {
        const email = user.email;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new CustomError(ErrorMessages.USER_EXISTS, httpStatus.BAD_REQUEST);
        }
        user.password = await bcrypt.hash(user.password, 12);
        return await User.create(user);
    },

    async loginUser (email: string, password: string): Promise<ILoginUserResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new CustomError(ErrorMessages.INVALID_CREDENTIALS, httpStatus.UNAUTHORIZED);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError(ErrorMessages.INVALID_CREDENTIALS, httpStatus.UNAUTHORIZED);
        }
        const payload = {
            email: user.email,
            userId: user.userId
        };
        const token = jwt.sign(
            payload,
            AUTH_SECRET,
            { expiresIn: AUTH_TOKEN_EXPIRY }
        );
        return { token, user };
    }
};

export default UserService;
