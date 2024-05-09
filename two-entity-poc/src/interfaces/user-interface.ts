import { Model, Optional } from "sequelize/types";
import { IBlog } from "./blog-interface";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  createBlog: (blog: IBlog) => Promise<any>; // Adjust the type of createBlog as needed
  getBlog: (id: number) => Promise<any>; // Adjust the type of getBlog as needed
  getBlogs: (qp?:any) => Promise<any>; // Adjust the type of getBlogs as needed
}
