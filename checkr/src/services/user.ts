import { User } from "../models/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomError from "../common/interfaces/custom-error";
import { IUser } from "../common/interfaces/user";
import { AUTH_SECRET } from "../common/constants/global";

const UserService = {
    async getUserById(userId: number) {
        return await User.findByPk(userId);
    },

    async signupUser (user: IUser) {
        const email = user.email;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }
        user.password = await bcrypt.hash(user.password, 12);
        return await User.create(user);
    },

    async loginUser (email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new CustomError("Invalid email or password", 401);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("Invalid email or password", 401);
        }
        const payload = {
            email: user.email,
            userId: user.userId
        };
        const token = jwt.sign(
            payload,
            AUTH_SECRET,
            { expiresIn: '1h' }
        );
        return { token, user };
    }
};

export default UserService;
