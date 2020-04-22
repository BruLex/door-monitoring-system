import { creatValidators } from '@utils';

import { Model, ModelSchema } from '../model';

export enum LockModes {
    Locked = 'LOCKED',
    Unlocked = 'UNLOCKED',
    Guard = 'GUARD'
}

enum LockIcons {
    Locked = 'lock',
    Unlocked = 'lock_open',
    Guard = 'security'
}

export const LOCK_MODE_ICON_MAP: { [key: string]: LockIcons } = {
    [LockModes.Locked]: LockIcons.Locked,
    [LockModes.Unlocked]: LockIcons.Unlocked,
    [LockModes.Guard]: LockIcons.Guard
};
export class DeviceModel extends Model {
    i_device: number = null;
    name: string = '';
    description: string = '';
    ip: string = '';
    status: boolean = false;
    mode: LockModes = LockModes.Guard;
    schema: ModelSchema = {
        addProxy: 'device/add_device',
        deleteProxy: 'device/delete_device',
        updateProxy: 'device/update_device',
        fields: {
            i_device: { type: 'number' },
            name: { type: 'string', validation: creatValidators({ type: 'str', required: true }) },
            description: { type: 'string', validation: creatValidators({ type: 'str', required: false }) },
            ip: { type: 'string', validation: creatValidators({ type: 'ip', required: true }) },
            status: { type: 'boolean' },
            mode: { type: 'string' }
        },
        idProperty: 'i_device',
        rootProperty: 'device_info'
    };

    get icon(): LockIcons {
        return LOCK_MODE_ICON_MAP[this.mode];
    }
}
