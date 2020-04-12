import { RouteSchema } from 'fastify';

import { deviceObjectSchema } from 'schemas/device.schema';
import { userObjectSchema } from 'schemas/user.schema';

const groupProperties: any = {
    type: 'object',
    properties: {
        i_group: {
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
        users: {
            type: 'array',
            items: userObjectSchema
        }
    }
};

export const getGroupListSchema: RouteSchema = {
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
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['success']
                },
                data: {
                    type: 'object',
                    properties: {
                        group_list: {
                            type: 'array',
                            items: groupProperties
                        }
                    }
                }
            }
        }
    }
};

export const addGroupSchema: RouteSchema = {
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
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['success']
                },
                data: {
                    type: 'object',
                    properties: {
                        i_group: {
                            type: 'number'
                        }
                    }
                }
            }
        }
    }
};

export const getGroupInfoSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_group'],
        properties: {
            i_group: {
                type: 'number'
            },
            extended_info: {
                type: 'boolean'
            }
        }
    },
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['success']
                },
                data: {
                    type: 'object',
                    properties: {
                        group_info: groupProperties
                    }
                }
            }
        }
    }
};

export const updateGroupSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_group', 'name', 'allowed_all'],
        properties: {
            ...groupProperties.properties,
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
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string'
                }
            }
        }
    }
};

export const deleteGroupSchema: RouteSchema = {
    body: {
        type: 'object',
        properties: {
            i_group: {
                type: 'number'
            },
            groups: {
                type: 'array',
                mimItems: 1,
                items: {
                    type: 'number'
                }
            }
        }
    },
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string'
                }
            }
        }
    }
};
