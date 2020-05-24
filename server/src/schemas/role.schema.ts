import { RouteSchema } from 'fastify';

import { cardObjectSchema } from './card.schema';
import { deviceObjectSchema } from './device.schema';
import { SchemaUtils } from './schema.utils';

export const roleObjectSchema: any = {
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
            items: deviceObjectSchema
        },
        cards: {
            type: 'array',
            items: cardObjectSchema
        }
    }
};

export class RoleSchema {
    static readonly getRoleListSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    role_list: {
                        type: 'array',
                        items: roleObjectSchema
                    }
                }
            }
        })
    };

    static readonly addRoleSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
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

    static readonly getRoleInfoSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory({
            data: {
                type: 'object',
                properties: {
                    role_info: roleObjectSchema
                }
            }
        })
    };

    static readonly updateRoleSchema: RouteSchema = {
        body: {
            type: 'object',
            required: ['i_role', 'name', 'allowed_all'],
            properties: {
                ...roleObjectSchema.properties,
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
        response: SchemaUtils.response2xxFactory()
    };

    static readonly deleteRoleSchema: RouteSchema = {
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
        response: SchemaUtils.response2xxFactory()
    };
}
