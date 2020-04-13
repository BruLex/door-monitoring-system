import { Column, DataType, Model, Table } from 'sequelize-typescript';

enum LockMode {
    Locked = 'LOCKED',
    Unlocked = 'UNLOCKED',
    Guard = 'GUARD'
}

@Table({
    tableName: 'device',
    modelName: 'device'
})
export class Device extends Model<Device> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        unique: true
    })
    i_device: number;

    @Column({ allowNull: false }) name: string;

    @Column({ allowNull: true }) description: string;

    @Column({ unique: true }) ip: string;

    @Column({
        allowNull: false,
        type: DataType.ENUM(LockMode.Locked, LockMode.Unlocked, LockMode.Guard),
        defaultValue: LockMode.Guard
    })
    mode: LockMode;

    status: boolean;

    toJSON(): object {
        return { ...super.toJSON(), status: this.status };
    }
}
