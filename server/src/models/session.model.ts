import { BelongsTo, Column, CreatedAt, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Role } from './role.model';
import { User } from './user.model';

@DefaultScope(() => ({
    include: [User]
}))
@Table({
    tableName: 'sessions',
    modelName: 'sessions',
    createdAt: 'createdAt'
})
export class Session extends Model<Session> {
    @Column({ primaryKey: true, autoIncrement: true }) i_session: number;
    @Column({ allowNull: false }) session: string;
    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt: Date;
    @ForeignKey(() => User) @Column({ allowNull: false }) i_user: number;
    @BelongsTo(() => User) user: User;
}
