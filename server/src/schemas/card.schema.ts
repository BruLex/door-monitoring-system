import { RouteSchema } from 'fastify';

import { SchemaUtils } from './schema.utils';

export const cardObjectSchema: any = {
    type: 'object',
    properties: {
        i_card: {
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
export class CardSchema {
    static readonly getCardListSchema: RouteSchema = {
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    card_list: {
                        type: 'array',
                        items: cardObjectSchema
                    }
                }
            }
        })
    };

    static readonly addCardSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    i_card: {
                        type: 'number'
                    }
                }
            }
        })
    };

    static readonly getCardInfoSchema: RouteSchema = {
        body: {
            type: 'object',
            required: ['i_card'],
            properties: {
                i_card: {
                    type: 'number'
                }
            }
        },
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    card_info: cardObjectSchema
                }
            }
        })
    };

    static readonly updateCardSchema: RouteSchema = {
        body: {
            type: 'object',
            required: ['i_card'],
            properties: cardObjectSchema.properties
        },
        response: SchemaUtils.response2xxFactory()
    };

    static readonly deleteCardSchema: RouteSchema = {
        body: {
            type: 'object',
            properties: {
                i_card: {
                    type: 'number'
                },
                cards: {
                    type: 'array',
                    mimItems: 1,
                    items: {
                        type: 'number'
                    }
                }
            }
        },
        response: SchemaUtils.response2xxFactory()
    };
}
