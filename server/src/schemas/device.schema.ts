import { RouteSchema } from 'fastify';

import { SchemaUtils } from './schema.utils';

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

export class DeviceSchema {
    static readonly getDeviceListSchema: RouteSchema = {
        body: {
            type: 'object',
            nullable: true,
            properties: {
                with_device_status: {
                    type: 'boolean'
                }
            }
        },
        response: SchemaUtils.response2xxFactory({
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

    static readonly addDeviceSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
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

    static readonly getDeviceInfoSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    device_info: deviceObjectSchema
                }
            }
        })
    };

    static readonly updateDeviceSchema: RouteSchema = {
        body: {
            type: 'object',
            required: ['i_device'],
            properties: deviceObjectSchema.properties
        },
        response: SchemaUtils.response2xxFactory()
    };

    static readonly deleteDeviceSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory()
    };
}
