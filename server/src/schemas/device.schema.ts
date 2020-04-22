import { RouteSchema } from 'fastify';

import { response2xxFactory } from 'src/schemas/schema.utils';

export const deviceObjectSchema: any = {
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

export const getDeviceListSchema: RouteSchema = {
    body: {
        type: 'object',
        nullable: true,
        properties: {
            with_device_status: {
                type: 'boolean'
            }
        }
    },
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                device_list: {
                    type: 'array',
                    items: deviceObjectSchema
                }
            }
        }
    })
};

export const addDeviceSchema: RouteSchema = {
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
    response: response2xxFactory({
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

export const getDeviceInfoSchema: RouteSchema = {
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
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                device_info: deviceObjectSchema
            }
        }
    })
};

export const updateDeviceSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_device'],
        properties: deviceObjectSchema.properties
    },
    response: response2xxFactory()
};

export const deleteDeviceSchema: RouteSchema = {
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
    response: response2xxFactory()
};
