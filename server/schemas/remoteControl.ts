import { RouteSchema } from 'fastify';

export const checkUID: RouteSchema = {
    body: {
        type: 'object',
        properties: {
            uid: {
                type: 'string'
            }
        },
        required: ['uid']
    },
    response: {
        200: {
            type: 'number'
        }
    }
};

export const registerDevice: RouteSchema = {
    body: {
        type: 'object',
        properties: {
            uid: {
                type: 'string'
            }
        },
        required: ['uid']
    },
    response: {
        200: {
            type: 'number'
        }
    }
};
