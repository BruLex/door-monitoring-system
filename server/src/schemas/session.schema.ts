import { RouteSchema } from 'fastify';

import { SchemaUtils } from './schema.utils';

const authHeader: object = {
    headers: {
        type: 'object',
        properties: {
            SID: { type: 'string' }
        },
        required: ['SID']
    }
};

export class SessionSchema {
    static readonly loginSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
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

    static readonly logoutSchema: RouteSchema = {
        ...authHeader,
        response: SchemaUtils.response2xxFactory()
    };

    static readonly changePasswordSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory()
    };

    static readonly changeMyData: RouteSchema = {
        ...authHeader
    };

    static readonly getMyDataSchema: RouteSchema = {
        ...authHeader,
        response: SchemaUtils.response2xxFactory({
            type: 'object',
            properties: {
                name: {
                    type: 'number'
                }
            }
        })
    };
}
