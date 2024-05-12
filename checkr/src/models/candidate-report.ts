import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Index } from 'sequelize-typescript';
import { Candidate } from './candidate';
import { Adjudication, Status } from '../constants/global';

@Table
export class CandidateReport extends Model<CandidateReport> {
    @Index
    @ForeignKey(() => Candidate)
    @Column({ primaryKey: true })
    candidateId!: number;

    @Column
    ({
        type: DataType.ENUM,
        values: [Status.CLEAR, Status.CONSIDER],
        allowNull: false
    })
    status!: Status;

    @Column
    ({
        type: DataType.ENUM,
        values: [Adjudication.ADVERSE_ACTION, Adjudication.ENGAGE],
        allowNull: false
    })
    adjudication!: Adjudication;

    @Column
    package!: string;

    @Column
    turnAroundTime!: number;

    @Column
    createdDate!: Date;

    @Column
    updatedDate!: Date;

    @BelongsTo(() => Candidate)
    candidate!: Candidate;
}
