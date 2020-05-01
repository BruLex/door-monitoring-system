import { Column, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'users',
    modelName: 'users'
})
export class User extends Model<User> {
    @Column({ primaryKey: true, autoIncrement: true }) i_user: number;
    @Column({ allowNull: false }) name: string;
    @Column({ allowNull: false }) login: string;
    @Column({ allowNull: false }) password: string;
}
