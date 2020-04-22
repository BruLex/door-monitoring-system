import { creatValidators } from '@utils';

import { Model, ModelSchema } from '../model';
import { DeviceModel } from './device.model';
import { CardModel } from './card.model';

export class RoleModel extends Model {
    i_role: number = null;
    name: string = '';
    allowed_all: boolean = false;
    allowed_devices?: DeviceModel[] = [];
    cards: CardModel[] = [];
    schema: ModelSchema = {
        addProxy: 'role/add_role',
        deleteProxy: 'role/delete_role',
        updateProxy: 'role/update_role',
        fields: {
            i_role: { type: 'number' },
            name: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            allowed_all: { type: 'boolean' },
            allowed_devices: { type: 'array', items: { type: DeviceModel } },
            cards: { type: 'array', items: { type: CardModel } }
        },
        idProperty: 'i_role',
        rootProperty: 'role_info'
    };

    getDeviceNames(): string {
        if (this.allowed_all) {
            return 'All';
        }

        if (!this.allowed_devices?.length) {
            return 'No devices';
        }

        return (
            'Name \t\t IP\n' +
            this.allowed_devices?.map((item: DeviceModel): string => item.name + ' \t ' + item.ip).join('\n')
        );
    }

    getCardNames(): string {
        if (!this.cards?.length) {
            return 'No cards';
        }

        return (
            'Name \t\t UUID\n' +
            this.cards?.map((item: CardModel): string => item.name + ' \t ' + item.uuid || 'Not set').join('\n')
        );
    }
}
