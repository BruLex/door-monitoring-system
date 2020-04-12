import { creatValidators } from '@utils';

import { Model, ModelSchema } from '../model';
import { DeviceModel } from './device.model';
import { UserModel } from './user.model';

export class GroupModel extends Model {
    i_group: number = null;
    name: string = '';
    allowed_all: boolean = false;
    allowed_devices?: DeviceModel[] = [];
    users: UserModel[] = [];
    schema: ModelSchema = {
        addProxy: 'group/add_group',
        deleteProxy: 'group/delete_group',
        updateProxy: 'group/update_group',
        fields: {
            i_group: { type: 'number' },
            name: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            allowed_all: { type: 'boolean' },
            allowed_devices: { type: 'array', items: { type: DeviceModel } },
            users: { type: 'array', items: { type: UserModel } }
        },
        idProperty: 'i_group',
        rootProperty: 'group_info'
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
            this.allowed_devices?.map((item: DeviceModel): string => item.name + '\t' + item.ip).join('\n')
        );
    }

    getUserNames(): string {
        if (!this.users?.length) {
            return 'No users';
        }

        return (
            'Name \t\t UUID\n' +
            this.users?.map((item: UserModel): string => item.name + '\t' + item.uuid || 'Not set').join('\n')
        );
    }
}
