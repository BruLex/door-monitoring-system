exports.checkUID = {
    body: {
        type: 'object',
        properties: {
            uid: {
                type: 'string',
            },
        },
        required: ['uid'],
    },
    response: {
        200: {
            type: 'number',
        },
    },
};

exports.RegisterDevice = {
    body: {
        type: 'object',
        properties: {
            uid: {
                type: 'string',
            },
        },
        required: ['uid'],
    },
    response: {
        200: {
            type: 'number',
        },
    },
};
