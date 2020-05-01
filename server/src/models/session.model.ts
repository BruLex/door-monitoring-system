import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { User } from './user.model';

@Table({
    tableName: 'sessions',
    modelName: 'sessions'
})
export class Session extends Model<Session> {
    @Column({ primaryKey: true, autoIncrement: true }) i_session: number;
    @Column({ allowNull: false }) session: string;
    @Column({ type: DataType.DATE }) createdAt: Date;
    @ForeignKey(() => User) @Column({ allowNull: false }) i_user: number;
    @BelongsTo(() => User) user: User;
}
