import { Table, Column, Model, HasMany, IsEmail, Index } from 'sequelize-typescript';
import { Candidate } from './candidate';

@Table
export class User extends Model<User> {
    @Column({ primaryKey: true, autoIncrement: true })
    userId!: number;

    @Column
    name!: string;

    @Index
    @IsEmail
    @Column
    email!: string;

    @Column
    password!: string;

    @HasMany(() => Candidate)
    candidates!: Candidate[];
}
