import { Model, Optional, DataTypes, InferAttributes } from "sequelize";
import { sequelize } from "../util/database";
import { IUser } from "../interfaces/user-interface";

interface UserCreationAttributes extends Optional<IUser, "id"> { }

interface UserInstance
  extends Model<IUser, UserCreationAttributes>,
  IUser {
  // Define the methods with correct types
  createBlog: (blog: any) => Promise<any>;
  getBlog: (id: number) => Promise<any>;
  getBlogs: () => Promise<any>;
}

class User extends Model<InferAttributes<UserInstance>> {
  public id!: number;
  public name!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define the methods
  public createBlog!: (blog: any) => Promise<any>;
  public getBlog!: (id: number) => Promise<any>;
  public getBlogs!: () => Promise<any>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
