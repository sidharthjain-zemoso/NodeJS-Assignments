import { IUser } from "../common/interfaces/user";
import { User } from "../models/user";

export interface ILoginUserResponse {
    token: string;
    user: User;
}

export interface IUserService {
    loginUser (email: string, password: string): Promise<ILoginUserResponse>;
    signupUser (user: IUser): Promise<User | null>;
    getUserById(userId: number): Promise<User | null>;
}