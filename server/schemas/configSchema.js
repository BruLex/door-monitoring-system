const configData = {
    only_remote_confirm_mode: {
        type: 'boolean'
    },
    allowed_attempts: {
        type: 'number'
    }
}

exports.updateConfigsSchema = {
    body: {
        type: 'object',
        properties: configData,
        required: ['only_remote_confirm_mode', 'allowed_attempts'],
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

exports.getConfigsSchema = {
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
                    properties: configData
                }
            }
        }
    }
};
