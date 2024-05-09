import { Model, Optional } from "sequelize/types";

export interface IBlog {
  id?: string;
  title: string;
  imageUrl: string;
  subtitle?: string;
  content: string;
}

interface BlogCreationAttributes extends Optional<IBlog, "id"> {}

export interface BlogInstance
  extends Model<IBlog, BlogCreationAttributes>,
    IBlog {}

export default BlogInstance;
