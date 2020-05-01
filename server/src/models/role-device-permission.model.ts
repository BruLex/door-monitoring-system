import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Device } from './device.model';
import { Role } from './role.model';

@Table({
    tableName: 'role_device_permissions',
    modelName: 'role_device_permissions'
})
export class RoleDevicePermission extends Model<RoleDevicePermission> {
    @Column({ primaryKey: true, autoIncrement: true }) i_role_device: number;
    @ForeignKey(() => Device) @Column({ onDelete: 'CASCADE' }) i_device: number;
    @ForeignKey(() => Role) @Column({ onDelete: 'CASCADE' }) i_role: number;
}
