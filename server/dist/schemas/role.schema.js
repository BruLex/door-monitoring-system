"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_schema_1 = require("./device.schema");
const schema_utils_1 = require("./schema.utils");
const card_schema_1 = require("./card.schema");
const roleProperties = {
    type: 'object',
    properties: {
        i_role: {
            type: 'number'
        },
        name: {
            type: 'string',
            maxLength: 255
        },
        allowed_all: {
            type: 'boolean'
        },
        allowed_devices: {
            type: 'array',
            items: device_schema_1.deviceObjectSchema
        },
        cards: {
            type: 'array',
            items: card_schema_1.cardObjectSchema
        }
    }
};
exports.getRoleListSchema = {
    body: {
        type: 'object',
        nullable: true,
        properties: {
            extended_info: {
                type: 'boolean',
                nullable: true
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                role_list: {
                    type: 'array',
                    items: roleProperties
                }
            }
        }
    })
};
exports.addRoleSchema = {
    body: {
        type: 'object',
        required: ['name', 'allowed_all'],
        properties: {
            name: {
                type: 'string',
                maxLength: 255
            },
            description: {
                type: 'string',
                maxLength: 255
            },
            allowed_all: {
                type: 'boolean'
            },
            allowed_devices: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['i_device'],
                    properties: {
                        i_device: {
                            type: 'number'
                        }
                    }
                }
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                i_role: {
                    type: 'number'
                }
            }
        }
    })
};
exports.getRoleInfoSchema = {
    body: {
        type: 'object',
        required: ['i_role'],
        properties: {
            i_role: {
                type: 'number'
            },
            extended_info: {
                type: 'boolean'
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                role_info: roleProperties
            }
        }
    })
};
exports.updateRoleSchema = {
    body: {
        type: 'object',
        required: ['i_role', 'name', 'allowed_all'],
        properties: Object.assign({}, roleProperties.properties, { allowed_devices: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['i_device'],
                    properties: {
                        i_device: {
                            type: 'number'
                        }
                    }
                }
            } })
    },
    response: schema_utils_1.response2xxFactory()
};
exports.deleteRoleSchema = {
    body: {
        type: 'object',
        properties: {
            i_role: {
                type: 'number'
            },
            roles: {
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
//# sourceMappingURL=role.schema.js.map