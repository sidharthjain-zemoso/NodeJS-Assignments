import { CreationOptional, DataTypes, InferAttributes, Model } from "sequelize";

import {sequelize} from "../util/database";
import IBlog from "../interfaces/blog-interface";
import { EMPTY_STRING_REGEX } from "../constants/regex";
import { ERROR_MESSAGES } from "../constants/validation-messages";
class Blog extends Model<InferAttributes<IBlog>> {
  declare id: CreationOptional<number>;
  declare title: String;
  declare price: number;
  declare imageUrl: String;
  declare description: String;
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty',
        },
        // Custom validation rule to check for empty string with escape characters
        isValidTitle (value: string) {
          if (EMPTY_STRING_REGEX.test(value)) {
            throw new Error(ERROR_MESSAGES.TITLE_MIN_LENGTH);
          }
        },
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "blogs",
  }
);


export default Blog;
