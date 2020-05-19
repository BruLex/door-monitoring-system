"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response2xxFactory = (property = {}) => ({
    '2xx': {
        type: 'object',
        properties: Object.assign({ status: {
                type: 'string',
                enum: ['success']
            } }, property)
    }
});
//# sourceMappingURL=schema.utils.js.map