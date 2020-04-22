import { Model, ModelSchema } from '../model';

export enum DoorStatus {
    Offline,
    Online
}

export enum LockedStatus {
    Locked,
    Unlocked,
    Guard
}

export enum StatusIcon {
    Locked = 'lock',
    Unlocked = 'lock_open',
    Guard = 'security',
    Opened = 'verified_card'
}

export class MonitorModel extends Model {
    mac: string;
    locked: LockedStatus;
    status: DoorStatus;
    icon: 'lock' | 'lock_open' | 'security' | 'verified_card';
    schema: ModelSchema = {
        fields: {
            mac: { type: 'string' },
            locked: { type: 'boolean' },
            status: { type: 'boolean' },
            icon: { type: 'string' }
        }
    };
}
