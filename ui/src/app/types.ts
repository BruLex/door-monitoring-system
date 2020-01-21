export interface RootComponentInterface {
    showLoadmask(): void;
    hideLoadmask(): void;
}


export interface DoorModel {
    i_door?: number;
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
    allowed_all?: boolean
    acl_list?: DoorModel[];
    users?: string[];
}
