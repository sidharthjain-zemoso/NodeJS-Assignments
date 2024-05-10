import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Candidate } from './candidate';

// Define the enum outside the class declaration
enum Status {
    Clear = 'clear',
    Consider = 'consider'
}

@Table
export class CourtSearch extends Model<CourtSearch> {
    @Column({ primaryKey: true, autoIncrement: true })
    searchId!: number;

    @Column
    search!: string;

    @Column({
        type: DataType.ENUM,
        values: ['clear', 'consider'],
        allowNull: false
    })
    status!: Status;

    @Column
    date!: Date;

    @ForeignKey(() => Candidate)
    @Column
    candidateId!: number;

    @BelongsTo(() => Candidate)
    candidate!: Candidate;
}
