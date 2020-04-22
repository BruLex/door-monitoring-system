import { BelongsToMany, Column, DefaultScope, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { Device } from './device.model';

import { RoleDevicePermissions } from './role-device-permissions.model';
import { Card } from './card.model';

@DefaultScope(() => ({
    attributes: ['i_role', 'name', 'allowed_all']
}))
@Scopes(() => ({
    extended: { include: [Card, Device] },
    with_devices: { include: [Device] }
}))
@Table({
    tableName: 'role',
    modelName: 'role'
})
export class Role extends Model<Role> {
    @Column({ primaryKey: true, autoIncrement: true }) i_role: number;
    @Column({ allowNull: false }) name: string;
    @Column({ allowNull: false, defaultValue: false }) allowed_all: boolean;
    @HasMany(() => Card, 'i_role') cards: Card[];
    @BelongsToMany(() => Device, () => RoleDevicePermissions) allowed_devices: Device[];
}
