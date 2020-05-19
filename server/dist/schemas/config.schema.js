"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = require("./schema.utils");
const configData = {
    allowed_attempts: {
        type: 'number'
    }
};
exports.updateConfigsSchema = {
    body: {
        type: 'object',
        properties: configData,
        required: ['allowed_attempts']
    },
    response: schema_utils_1.response2xxFactory()
};
exports.getConfigsSchema = {
    response: schema_utils_1.response2xxFactory({
        data: {
            type: 'object',
            properties: configData
        }
    })
};
//# sourceMappingURL=config.schema.js.map