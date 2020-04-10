import { RouteSchema } from 'fastify';

export const userObjectSchema: any = {
    type: 'object',
    properties: {
        i_user: {
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
        i_group: {
            type: 'number'
        }
    }
};

export const getUserListSchema: RouteSchema = {
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string'
                },
                data: {
                    type: 'object',
                    properties: {
                        user_list: {
                            type: 'array',
                            items: userObjectSchema
                        }
                    }
                }
            }
        }
    }
};

export const addUserSchema: RouteSchema = {
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
            i_group: {
                type: 'number'
            }
        }
    },
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string'
                },
                data: {
                    type: 'object',
                    properties: {
                        i_user: {
                            type: 'number'
                        }
                    }
                }
            }
        }
    }
};

export const getUserInfoSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_user'],
        properties: {
            i_user: {
                type: 'number'
            }
        }
    },
    response: {
        '2xx': {
            type: 'object',
            properties: {
                status: {
                    type: 'string'
                },
                data: {
                    type: 'object',
                    properties: {
                        user_info: userObjectSchema
                    }
                }
            }
        }
    }
};

export const updateUserSchema: RouteSchema = {
    body: {
        type: 'object',
        required: ['i_user'],
        properties: userObjectSchema.properties
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

export const deleteUserSchema: RouteSchema = {
    body: {
        type: 'object',
        properties: {
            i_user: {
                type: 'number'
            },
            users: {
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
