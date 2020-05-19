import { Card, Device } from '../models';
import { LockMode } from './constants';

export interface ApplyConfigOptions {
    deviceIp: string;
    deviceMode: LockMode;
    generateToken?: boolean;
    token?: string;
}

export interface LogActionOptions {
    card?: Card;
    device?: Device;
    ip?: string;
    uuid?: string;
    error?: string;
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

export interface ServerInstanceConfig {
    database?: {
        /**
         * The name of the database
         */
        database?: string;

        /**
         * The username which is used to authenticate against the database.
         */
        username?: string;

        /**
         * The password which is used to authenticate against the database.
         */
        password?: string;
        /**
         * The host of the relational database.
         *
         * @default 'localhost'
         */
        host?: string;

        /**
         * The port of the relational database.
         */
        port?: number;

        /**
         * Default options for sequelize.sync
         */
        sync?: {
            /**
             * If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
             */
            force?: boolean;

            /**
             * If alter is true, each DAO will do ALTER TABLE ... CHANGE ...
             * Alters tables to fit models. Not recommended for production use.
             * Deletes data in columns that were removed or had their type changed in the model.
             */
            alter?: boolean;
        };
    };
    server?: {
        ip?: string;
        /**
         * The port of the server.
         */
        port?: number;
        logger?: {
            level: 'info' | 'error' | 'debug' | 'fatal' | 'warn' | 'trace' | 'child';
            file?: string;
        };
    };
}
