import { Column, Model, Table } from 'sequelize-typescript';

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
}
