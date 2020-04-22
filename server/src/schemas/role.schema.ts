import { RouteSchema } from 'fastify';
import { deviceObjectSchema } from './device.schema';

import { response2xxFactory } from './schema.utils';
import { cardObjectSchema } from './card.schema';

const roleProperties: any = {
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

export const getRoleListSchema: RouteSchema = {
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
    response: response2xxFactory({
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

export const addRoleSchema: RouteSchema = {
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
    response: response2xxFactory({
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

export const getRoleInfoSchema: RouteSchema = {
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
    response: response2xxFactory({
        data: {
            type: 'object',
            properties: {
                role_info: roleProperties
            }
        }
    })
};

export const updateRoleSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_role', 'name', 'allowed_all'],
        properties: {
            ...roleProperties.properties,
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
    response: response2xxFactory()
};

export const deleteRoleSchema: RouteSchema = {
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
    response: response2xxFactory()
};
