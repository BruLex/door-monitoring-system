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

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

export interface GroupModel {
    name: string;
    allowed_all?: boolean;
    allowed_devices?: DeviceModel[];
    users?: string[];
}
