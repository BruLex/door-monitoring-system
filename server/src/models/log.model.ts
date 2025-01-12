import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Card } from './card.model';
import { Device } from './device.model';
import { Role } from './role.model';

@Table({
    tableName: 'logs',
    modelName: 'logs'
})
export class Log extends Model<Log> {
    @Column({ primaryKey: true, autoIncrement: true }) i_log: number;

    @ForeignKey(() => Device) @Column({ onDelete: 'SET NULL' }) i_device: number;
    @Column device_name: string;
    @BelongsTo(() => Device) device: Device;

    @ForeignKey(() => Role) @Column({ onDelete: 'SET NULL' }) i_role: number;
    @Column role_name: string;
    @BelongsTo(() => Role) role: Role;

    @ForeignKey(() => Card) @Column({ onDelete: 'SET NULL' }) i_card: number;
    @Column card_name: string;
    @BelongsTo(() => Card) card: Card;

    @Column({ type: DataType.DATE }) time: Date;
    @Column access: boolean;
    @Column device_ip: string;
    @Column uuid: string;
    @Column error: string;
}
