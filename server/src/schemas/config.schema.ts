import { RouteSchema } from 'fastify';

const configData: { only_remote_confirm_mode: { type: string }; allowed_attempts: { type: string } } = {
    only_remote_confirm_mode: {
        type: 'boolean'
    },
    allowed_attempts: {
        type: 'number'
    }
};

export const updateConfigsSchema: RouteSchema = {
    body: {
        type: 'object',
        properties: configData,
        required: ['only_remote_confirm_mode', 'allowed_attempts']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['success']
                }
            }
        }
    }
};

export const getConfigsSchema: RouteSchema = {
    response: {
        200: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['success']
                },
                data: {
                    type: 'object',
                    properties: configData
                }
            }
        }
    }
};
