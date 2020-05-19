"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = require("src/schemas/schema.utils");
const authHeader = {
    headers: {
        type: 'object',
        properties: {
            SID: { type: 'string' }
        },
        required: ['SID']
    }
};
exports.loginSchema = {
    body: {
        type: 'object',
        required: ['login', 'password'],
        properties: {
            login: {
                type: 'string'
            },
            password: {
                type: 'string'
            }
        }
    },
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: {
                session: {
                    type: 'string'
                }
            }
        }
    })
};
exports.logoutSchema = Object.assign({}, authHeader, { response: schema_utils_1.response2xxFactory() });
exports.changePasswordSchema = {
    body: {
        type: 'object',
        required: ['i_card'],
        properties: {
            login: {
                type: 'string'
            },
            old_password: {
                type: 'string'
            },
            new_password: {
                type: 'string'
            }
        }
    },
    response: schema_utils_1.response2xxFactory()
};
exports.changeMyData = Object.assign({}, authHeader);
exports.getMyDataSchema = Object.assign({}, authHeader, { response: schema_utils_1.response2xxFactory({
        type: 'object',
        properties: {
            name: {
                type: 'number'
            }
        }
    }) });
//# sourceMappingURL=session.schema.js.map