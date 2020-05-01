export class Constants {
    static readonly defaultTimeout: number = 4000;
    static readonly defaultToken: string = 'fee275a0-8155-55fe-a071-ce7f580e1eac';
    static readonly timestampOneWeek: number = 604800;
}

export enum DeviceApiEndpoints {
    Ping = '/ping',
    UpdateConfig = '/update_config'
}
