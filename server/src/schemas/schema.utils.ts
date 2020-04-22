import { JSONSchema } from 'fastify';

export const response2xxFactory: (property?: object) => { [key: string]: JSONSchema } = (property: object = {}) => ({
    '2xx': {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: ['success']
            },
            ...property
        }
    }
});
