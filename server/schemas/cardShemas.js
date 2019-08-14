'use strict'

const cardProperties = {
    i_card: {
        type: 'number'
    },
    uid: {
        type: 'string'
    },
    is_system: {
        type: 'boolean'
    },
    is_used: {
        type: 'boolean'
    },
    _id: {
        type: 'string'
    }
};

exports.addCardSchema = {
    body: {
        type: 'object',
        required: ['uid'],
        properties: {
            uid: {
                type: 'string'
            },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                status: {
                    type: 'string'
                },
                message: {
                    type: 'string'
                },
                data: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    }
};

exports.getCardInfoSchema = {
        body: {
            type: 'object',
            required: ['_id'],
            properties: {
                _id: {
                    type: 'string'
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string'
                    },
                    message: {
                        type: 'string'
                    },
                    data: {
                        type:'object',
                        properties: {
                            card_info: {
                                type: 'object',
                                nullable: true,
                                properties: cardProperties
                            }
                        }
                    }
                }
            }
        }
};


exports.getCardListSchema = {
}

exports.updateCardInfoSchema = {
}

exports.deleteCardSchema = {
}


