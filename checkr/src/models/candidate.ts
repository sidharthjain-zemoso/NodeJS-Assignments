import { Table, Column, Model, ForeignKey, BelongsTo, Length, IsEmail, isDataType, Index, HasMany, HasOne } from 'sequelize-typescript';
import { User } from './user';
import { ICandidate } from '../common/interfaces/candidate';
import { CandidateReport } from './candidate-report';
import { CourtSearch } from './court-search';
import { PreAdverseEmail } from './pre-adverse-email';

@Table
export class Candidate extends Model<ICandidate> {
    @Column({ primaryKey: true, autoIncrement: true })
    candidateId!: number;

    @Length({ min: 3, max: 45 })
    @Column
    name!: string;

    @Index
    @IsEmail
    @Length({ min: 6, max: 45 })
    @Column
    email!: string;

    @Column
    dob!: Date;

    @Length({ min: 10, max: 10 })
    @Column
    phone!: string;

    @Length({ min: 5, max: 45 })
    @Column
    location!: string; // we can create address model and then get location

    @Length({ min: 5, max: 6 })
    @Column
    zipcode!: string;

    @Column
    socialSecurity!: string;

    @Column
    driversLicense!: string;

    @Index
    @ForeignKey(() => User)
    @Column
    userId!: number;

    @BelongsTo(() => User)
    user!: User;

    @HasMany(() => CourtSearch)
    courtSearch!: CourtSearch[];

    @HasOne(() => CandidateReport)
    candidateReport!: CandidateReport;

    @HasOne(() => PreAdverseEmail)
    preAdverseEmail!: PreAdverseEmail;
}