import { RouteSchema } from 'fastify';

import { response2xxFactory } from './schema.utils';

const configData: object = {
    allowed_attempts: {
        type: 'number'
    }
};

export const updateConfigsSchema: RouteSchema = {
    body: {
        type: 'object',
        properties: configData,
        required: ['allowed_attempts']
    },
    response: response2xxFactory()
};

export const getConfigsSchema: RouteSchema = {
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: configData
        }
    })
};
