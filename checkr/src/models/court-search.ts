import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Index } from 'sequelize-typescript';
import { Candidate } from './candidate';
import { Status } from '../constants/global';

@Table
export class CourtSearch extends Model<CourtSearch> {
    @Column({ primaryKey: true, autoIncrement: true })
    searchId!: number;

    @Column
    search!: string;

    @Column({
        type: DataType.ENUM,
        values: [Status.CLEAR, Status.CONSIDER],
        allowNull: false
    })
    status!: Status;

    @Column
    date!: Date;

    @Index
    @ForeignKey(() => Candidate)
    @Column
    candidateId!: number;

    @BelongsTo(() => Candidate)
    candidate!: Candidate;
}
