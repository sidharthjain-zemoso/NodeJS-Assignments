import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Candidate } from './candidate';

enum Status {
    Clear = 'clear',
    Consider = 'consider'
}

enum Adjudication {
    AdverseAction = 'adverse action',
    Engage = 'engage'
}

@Table
export class CandidateReport extends Model<CandidateReport> {
    @Column({ primaryKey: true, autoIncrement: true })
    reportId!: number;

    @Column
    ({
        type: DataType.ENUM,
        values: ['clear', 'consider'],
        allowNull: false
    })
    status!: Status;

    @Column
    ({
        type: DataType.ENUM,
        values: ['adverse action', 'engage'],
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

    @ForeignKey(() => Candidate)
    @Column
    candidateId!: number;

    @BelongsTo(() => Candidate)
    candidate!: Candidate;
}
