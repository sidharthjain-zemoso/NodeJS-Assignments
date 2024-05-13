import { Sequelize } from 'sequelize-typescript';
import { Candidate } from '../models/candidate';
import dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { User } from '../models/user';
import { CourtSearch } from '../models/court-search';
import { CandidateReport } from '../models/candidate-report';
import { NullishPropertiesOf } from 'sequelize/types/utils';

// Load environment variables from .env file
dotenv.config();

export const sequelize = new Sequelize({
    dialect: (process.env.DB_DIALECT! as Dialect),
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    models: [User, Candidate, CourtSearch, CandidateReport]
});

export const syncModels = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync models with the database
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');

        let user = await User.findByPk(1);
        if (!user) {
            user = await User.create({ name: "Test", email: "test@test.com", password: "test" } as Omit<User, NullishPropertiesOf<User>>);
        }

        console.log('User:', user.toJSON());

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}