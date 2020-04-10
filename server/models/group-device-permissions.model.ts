import { Device } from 'models/device.model';
import { Group } from 'models/group.model';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'group_device_permission',
    modelName: 'group_device_permission'
})
export class GroupDevicePermissions extends Model<GroupDevicePermissions> {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    i_group_device: number;

    @ForeignKey(() => Device) @Column i_device: number;
    @ForeignKey(() => Group) @Column i_group: number;
}
