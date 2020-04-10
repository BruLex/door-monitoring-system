import { GroupDevicePermissions } from 'models/group-device-permissions.model';
import { BelongsToMany, Column, DefaultScope, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { Device } from './device.model';
import { User } from './user.model';

@DefaultScope(() => ({
    attributes: ['i_group', 'name', 'allowed_all']
}))
@Scopes(() => ({
    extended: {
        include: [{ model: User }, { model: Device }]
    }
}))
@Table({
    tableName: 'group',
    modelName: 'group'
})
export class Group extends Model<Group> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        unique: true
    })
    i_group: number;

    @Column({ allowNull: false }) name: string;

    @Column({ allowNull: false, defaultValue: false }) allowed_all: boolean;

    @HasMany(() => User) users: User[];

    @BelongsToMany(() => Device, () => GroupDevicePermissions) allowed_devices: Device[];
}
