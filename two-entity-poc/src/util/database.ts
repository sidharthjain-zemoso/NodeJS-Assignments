import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('twoEntityPoc', 'sidharth-jain', 'cycle@123', {
  dialect: 'mysql',
  host: 'localhost'
});
