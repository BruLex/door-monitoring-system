import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Device } from './device.model';
import { Group } from './group.model';
import { User } from './user.model';

@Table({
    tableName: 'log',
    modelName: 'log'
})
export class Log extends Model<Log> {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    i_log: number;

    @ForeignKey(() => Device) @Column i_device: number;
    @Column device_name: string;

    @ForeignKey(() => Group) @Column i_group: number;
    @Column group_name: string;

    @ForeignKey(() => User) @Column i_user: number;
    @Column user_name: string;

    @Column time: Date;
    @Column access: number;
    @Column device_ip: string;
    @Column uuid: string;
}
