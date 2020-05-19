import { BelongsTo, Column, DefaultScope, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';

import { Role } from './role.model';

@DefaultScope(() => ({
    attributes: ['i_card', 'uuid', 'name', 'i_role']
}))
@Scopes(() => ({
    extended_access_map: { include: [Role.scope('with_devices')] }
}))
@Table({
    tableName: 'cards',
    modelName: 'cards'
})
export class Card extends Model<Card> {
    @Column({ primaryKey: true, autoIncrement: true }) i_card: number;
    @Column uuid: string;
    @Column name: string;
    @ForeignKey(() => Role) @Column({ onDelete: 'SET NULL' }) i_role: number;
    @BelongsTo(() => Role) role: Role;
}
