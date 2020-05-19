import { RouteSchema } from 'fastify';

import { SchemaUtils } from './schema.utils';

export class AccessControlSchema {
    static readonly checkCard: RouteSchema = {
        body: {
            type: 'object',
            required: ['uuid'],
            properties: {
                uuid: {
                    type: 'string'
                }
            }
        },
        response: SchemaUtils.response2xxFactory()
    };
}
