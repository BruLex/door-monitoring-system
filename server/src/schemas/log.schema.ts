import { RouteSchema } from 'fastify';

import { cardObjectSchema } from './card.schema';
import { deviceObjectSchema } from './device.schema';
import { roleObjectSchema } from './role.schema';
import { SchemaUtils } from './schema.utils';

export const logObjectSchema: any = {
    type: 'object',
    properties: {
        i_log: {
            type: 'number'
        },
        i_device: {
            type: 'number'
        },
        device_name: {
            type: 'string'
        },
        device: deviceObjectSchema,
        i_role: {
            type: 'number'
        },
        role_name: {
            type: 'string'
        },
        role: roleObjectSchema,
        i_card: {
            type: 'number'
        },
        card_name: {
            type: 'string'
        },
        card: cardObjectSchema,
        time: {
            type: 'string'
        },
        access: {
            type: 'boolean',
            nullable: true
        },
        device_ip: {
            type: 'string'
        },
        uuid: {
            type: 'string'
        },
        error: {
            type: 'string'
        }
    }
};
export class LogSchema {
    static readonly getSystemLogsSchema: RouteSchema = {
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    logs: {
                        type: 'array',
                        items: logObjectSchema
                    }
                }
            }
        })
    };
}
