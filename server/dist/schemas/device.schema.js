"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = require("src/schemas/schema.utils");
exports.deviceObjectSchema = {
    type: 'object',
    properties: {
        i_device: {
            type: 'number'
        },
        name: {
            type: 'string',
            maxLength: 255
        },
        description: {
            type: 'string',
            maxLength: 255,
            nullable: true
        },
        ip: {
            type: 'string',
            maxLength: 15
        },
        status: {
            type: 'boolean'
        },
        mode: {
            type: 'string',
            enum: ['LOCKED', 'UNLOCKED', 'GUARD']
        }
    }
};
exports.getDeviceListSchema = {
    body: {
        type: 'object',
        nullable: true,
        properties: {
            with_device_status: {
                type: 'boolean'
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                device_list: {
                    type: 'array',
                    items: exports.deviceObjectSchema
                }
            }
        }
    })
};
exports.addDeviceSchema = {
    body: {
        type: 'object',
        required: ['name', 'ip'],
        properties: {
            name: {
                type: 'string',
                maxLength: 255
            },
            description: {
                type: 'string',
                maxLength: 255
            },
            ip: {
                type: 'string',
                maxLength: 15
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                i_device: {
                    type: 'number'
                }
            }
        }
    })
};
exports.getDeviceInfoSchema = {
    body: {
        type: 'object',
        required: ['i_device'],
        properties: {
            i_device: {
                type: 'number'
            },
            with_device_status: {
                type: 'boolean'
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                device_info: exports.deviceObjectSchema
            }
        }
    })
};
exports.updateDeviceSchema = {
    body: {
        type: 'object',
        required: ['i_device'],
        properties: exports.deviceObjectSchema.properties
    },
    response: schema_utils_1.response2xxFactory()
};
exports.deleteDeviceSchema = {
    body: {
        type: 'object',
        properties: {
            i_device: {
                type: 'number'
            },
            devices: {
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
//# sourceMappingURL=device.schema.js.map