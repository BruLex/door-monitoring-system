import { RouteSchema } from 'fastify';

import { response2xxFactory } from './schema.utils';

export const userObjectSchema: any = {
    type: 'object',
    properties: {
        i_user: {
            type: 'number'
        },
        name: {
            type: 'string',
            maxLength: 255
        },
        uuid: {
            type: 'string',
            maxLength: 255
        },
        i_role: {
            type: 'number',
            nullable: true
        }
    }
};

export const getUserListSchema: RouteSchema = {
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                user_list: {
                    type: 'array',
                    items: userObjectSchema
                }
            }
        }
    })
};

export const addUserSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['name', 'uuid'],
        properties: {
            name: {
                type: 'string',
                maxLength: 255
            },
            uuid: {
                type: 'string',
                maxLength: 255
            },
            i_role: {
                type: 'number'
            }
        }
    },
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                i_user: {
                    type: 'number'
                }
            }
        }
    })
};

export const getUserInfoSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_user'],
        properties: {
            i_user: {
                type: 'number'
            }
        }
    },
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                user_info: userObjectSchema
            }
        }
    })
};

export const updateUserSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_user'],
        properties: userObjectSchema.properties
    },
    response: response2xxFactory()
};

export const deleteUserSchema: RouteSchema = {
    body: {
        type: 'object',
        properties: {
            i_user: {
                type: 'number'
            },
            users: {
                type: 'array',
                mimItems: 1,
                items: {
                    type: 'number'
                }
            }
        }
    },
    response: response2xxFactory()
};
