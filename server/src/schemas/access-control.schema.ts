import { RouteSchema } from 'fastify';

import { response2xxFactory } from './schema.utils';

export const checkCard: RouteSchema = {
    body: {
        type: 'object',
        required: ['uuid'],
        properties: {
            uuid: {
                type: 'string'
            }
        }
    },
    response: response2xxFactory()
};
