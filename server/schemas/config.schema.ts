import { RouteSchema } from 'fastify';

const configData = {
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
                    enum: ['success', 'fail', 'error']
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
                    enum: ['success', 'fail', 'error']
                },
                data: {
                    type: 'object',
                    properties: configData
                }
            }
        }
    }
};
