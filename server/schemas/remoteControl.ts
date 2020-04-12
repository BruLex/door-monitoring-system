import { RouteSchema } from 'fastify';

export const checkUID: RouteSchema = {
    body: {
        type: 'object',
        required: ['uid'],
        properties: {
            uid: {
                type: 'string'
            }
        }
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
        required: ['uid'],
        properties: {
            uid: {
                type: 'string'
            }
        }
    },
    response: {
        200: {
            type: 'number'
        }
    }
};
