import { Table, Column, Model, ForeignKey, BelongsTo, Length, IsEmail, isDataType, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Candidate extends Model<Candidate> {
    @Column({ primaryKey: true, autoIncrement: true })
    candidateId!: number;

    @Length({ min: 3, max: 45 })
    @Column
    name!: string;

    @IsEmail
    @Length({ min: 6, max: 45 })
    @Column
    email!: string;

    @Column
    dob!: Date;

    @Length({ min: 10, max: 10 })
    @Column
    phone!: string;

    @Length({ min: 5, max: 6 })
    @Column
    zipcode!: string;

    @Column
    socialSecurity!: string;

    @Column
    driversLicense!: string;

    @Column
    createdDate!: Date;

    @Index
    @ForeignKey(() => User)
    @Column
    userId!: number;

    @BelongsTo(() => User)
    user!: User;
}