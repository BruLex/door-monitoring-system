export enum LockMode {
    Locked = 'LOCKED',
    Unlocked = 'UNLOCKED',
    Guard = 'GUARD'
}

export interface DeviceConfig {
    /**
     * Decoded base64 login and password for device
     */
    token?: string;

    /**
     * Current server address
     */
    server_address?: string;
    /**
     * Lock mode which device should follow
     */
    mode: LockMode;
}
