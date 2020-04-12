import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Group } from './group.model';

@Table({
    tableName: 'user',
    modelName: 'user'
})
export class User extends Model<User> {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    i_user: number;

    @Column uuid: string;
    @Column name: string;
    @ForeignKey(() => Group) @Column i_group: number;
}
