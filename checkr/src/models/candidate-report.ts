import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Candidate } from './candidate';
import { Adjudication, Status } from '../common/constants/global';

@Table
export class CandidateReport extends Model<CandidateReport> {
    // @Index mySql engine innoDB by default indexes on primary keys
    @ForeignKey(() => Candidate)
    @Column({ primaryKey: true })
    candidateId!: number;

    @Column ({
        type: DataType.ENUM,
        values: [Status.CLEAR, Status.CONSIDER],
        allowNull: false
    })
    status!: Status;

    @Column ({
        type: DataType.ENUM,
        values: [Adjudication.ADVERSE_ACTION, Adjudication.ENGAGE],
        allowNull: true
    })
    adjudication!: Adjudication;

    @Column
    package!: string;

    @Column
    turnAroundTime!: number;

    @BelongsTo(() => Candidate)
    candidate!: Candidate;
}
