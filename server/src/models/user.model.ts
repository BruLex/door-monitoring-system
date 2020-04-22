import {
    BelongsTo,
    BelongsToMany,
    Column,
    DefaultScope,
    ForeignKey,
    HasMany,
    Model,
    Scopes,
    Table
} from 'sequelize-typescript';

import { Device } from './device.model';
import { RoleDevicePermissions } from './role-device-permissions.model';
import { Role } from './role.model';

@DefaultScope(() => ({
    attributes: ['i_user', 'uuid', 'name', 'i_role']
}))
@Scopes(() => ({
    extended_access_map: { include: [Role.scope('with_devices')] }
}))
@Table({
    tableName: 'user',
    modelName: 'user'
})
export class User extends Model<User> {
    @Column({ primaryKey: true, autoIncrement: true }) i_user: number;
    @Column uuid: string;
    @Column name: string;
    @ForeignKey(() => Role) @Column({ onDelete: 'SET NULL' }) i_role: number;
    @BelongsTo(() => Role) role: Role;
}
