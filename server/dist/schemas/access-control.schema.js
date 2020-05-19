"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = require("./schema.utils");
exports.checkCard = {
    body: {
        type: 'object',
        required: ['uuid'],
        properties: {
            uuid: {
                type: 'string'
            }
        }
    },
    response: schema_utils_1.response2xxFactory()
};
//# sourceMappingURL=access-control.schema.js.map