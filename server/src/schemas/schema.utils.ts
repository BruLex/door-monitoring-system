import { JSONSchema } from 'fastify';

export class SchemaUtils {
    static response2xxFactory(property: object = {}): { [key: string]: JSONSchema } {
        return {
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
        };
    }
}
