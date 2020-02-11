export interface RootComponentInterface {
    showLoadmask(): void;

    hideLoadmask(): void;
}

export interface DeviceModel {
    i_device?: number;
    name: string;
    description: string;
    ip: string;
}

export interface User {
    i_user: number;
    name: string;
    uuid: string;
    i_group?: number;
}

export interface GroupModel {
    i_group?: number;
    name: string;
    allowed_all?: boolean;
    allowed_devices?: DeviceModel[];
    users?: string[];
}
