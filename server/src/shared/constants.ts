export class Constants {
    static readonly defaultTimeout: number = 4000;
    static readonly defaultToken: string = '00000000-0000-0000-0000-000000000000';
    static readonly timestampOneWeek: number = 604800;
}

export enum DeviceApiEndpoints {
    Ping = '/ping',
    UpdateConfig = '/update_config'
}

export enum LockMode {
    Locked = 'LOCKED',
    Unlocked = 'UNLOCKED',
    Guard = 'GUARD'
}
