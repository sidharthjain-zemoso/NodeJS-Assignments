import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { EmailConfig } from '../common/interfaces/pre-adverse-email-config';
import { Candidate } from './candidate';

@Table
export class PreAdverseEmail extends Model<EmailConfig> {
    @Column
    fromEmail!: string;

    @Column({ primaryKey: true })
    toEmail!: string;

    @Column
    subject!: string;

    @Column
    body!: string;

    @Column
    count!: number;

    @Column
    days!: number;

    @ForeignKey(() => Candidate)
    candidateId!: number;

    @BelongsTo(() => Candidate)
    candidate!: Candidate;
}