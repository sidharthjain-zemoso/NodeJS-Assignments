import { Dialect, Sequelize } from "sequelize";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD, {
  dialect: (process.env.DB_DIALECT as Dialect),
  host: process.env.DB_HOST
});
