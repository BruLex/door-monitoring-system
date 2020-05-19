"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = require("./schema.utils");
exports.cardObjectSchema = {
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
exports.getCardListSchema = {
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                card_list: {
                    type: 'array',
                    items: exports.cardObjectSchema
                }
            }
        }
    })
};
exports.addCardSchema = {
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
    response: schema_utils_1.response2xxFactory({
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
exports.getCardInfoSchema = {
    body: {
        type: 'object',
        required: ['i_card'],
        properties: {
            i_card: {
                type: 'number'
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                card_info: exports.cardObjectSchema
            }
        }
    })
};
exports.updateCardSchema = {
    body: {
        type: 'object',
        required: ['i_card'],
        properties: exports.cardObjectSchema.properties
    },
    response: schema_utils_1.response2xxFactory()
};
exports.deleteCardSchema = {
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
    response: schema_utils_1.response2xxFactory()
};
//# sourceMappingURL=card.schema.js.map