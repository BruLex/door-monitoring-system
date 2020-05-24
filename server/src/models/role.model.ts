import { BelongsToMany, Column, DefaultScope, HasMany, Model, Scopes, Table } from 'sequelize-typescript';

import { Card } from './card.model';
import { Device } from './device.model';
import { RoleDevicePermission } from './role-device-permission.model';

@DefaultScope(() => ({
    attributes: ['i_role', 'name', 'allowed_all']
}))
@Scopes(() => ({
    extended: { include: [Card, Device] },
    with_devices: { include: [Device] }
}))
@Table({
    tableName: 'roles',
    modelName: 'roles'
})
export class Role extends Model<Role> {
    @Column({ primaryKey: true, autoIncrement: true }) i_role: number;
    @Column({ allowNull: false }) name: string;
    @Column({ allowNull: false, defaultValue: false }) allowed_all: boolean;
    @HasMany(() => Card, 'i_role') cards: Card[];
    @BelongsToMany(() => Device, () => RoleDevicePermission) allowed_devices: Device[];
}
