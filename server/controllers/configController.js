'use strict';
const fs = require('fs');
const jsend = require('jsend');
const configSchemas = require('../schemas/configSchema');

module.exports = async (fastify, options) => {
    fastify.post('/api/config/get_configs', { schema: configSchemas.getConfigsSchema }, async () => {
        fastify.log.info('sadasdasd');
        return jsend.success(JSON.parse(fs.readFileSync('../server/configs/config.json')));
    });

    fastify.post('/api/config/update_configs', { schema: configSchemas.updateConfigsSchema }, async req => {
        const err = fs.writeFileSync('../server/configs/config.json', JSON.stringify(req.body, null, 2));
        if (err) {
            return jsend.error(err);
        }
        return jsend.success(true);
    });
};
