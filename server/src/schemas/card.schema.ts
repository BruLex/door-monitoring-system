import { RouteSchema } from 'fastify';

import { response2xxFactory } from './schema.utils';

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

export const getCardListSchema: RouteSchema = {
    response: response2xxFactory({
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

export const addCardSchema: RouteSchema = {
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
                i_card: {
                    type: 'number'
                }
            }
        }
    })
};

export const getCardInfoSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_card'],
        properties: {
            i_card: {
                type: 'number'
            }
        }
    },
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                card_info: cardObjectSchema
            }
        }
    })
};

export const updateCardSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_card'],
        properties: cardObjectSchema.properties
    },
    response: response2xxFactory()
};

export const deleteCardSchema: RouteSchema = {
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
    response: response2xxFactory()
};
