import { RouteSchema } from 'fastify';

import { response2xxFactory } from 'src/schemas/schema.utils';
import { cardObjectSchema } from 'src/schemas/card.schema';

const authHeader: object = {
    headers: {
        type: 'object',
        properties: {
            SID: { type: 'string' }
        },
        required: ['SID']
    }
};

export const loginSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['login', 'password'],
        properties: {
            login: {
                type: 'string'
            },
            password: {
                type: 'string'
            }
        }
    },
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                session: {
                    type: 'string'
                }
            }
        }
    })
};

export const logoutSchema: RouteSchema = {
    ...authHeader,
    response: response2xxFactory()
};

export const changePasswordSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_card'],
        properties: {
            login: {
                type: 'string'
            },
            old_password: {
                type: 'string'
            },
            new_password: {
                type: 'string'
            }
        }
    },
    response: response2xxFactory()
};

export const changeMyData: RouteSchema = {
    ...authHeader
};

export const getMyDataSchema: RouteSchema = {
    ...authHeader,
    response: response2xxFactory({
        type: 'object',
        properties: {
            name: {
                type: 'number'
            }
        }
    })
};
