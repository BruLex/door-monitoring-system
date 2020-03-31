const fs = require('fs');
const jsend = require('jsend');
const configSchemas = require('../schemas/config');

module.exports = async (fastify, options) => {
    fastify.post('get_configs', { schema: configSchemas.getConfigsSchema }, async () => {
        fastify.log.info('sadasdasd');
        return jsend.success(JSON.parse(fs.readFileSync('../server/configs/config.json')));
    });

    fastify.post('update_configs', { schema: configSchemas.updateConfigsSchema }, async req => {
        const err = fs.writeFileSync('../server/configs/config.json', JSON.stringify(req.body, null, 2));
        if (err) {
            return jsend.error(err);
        }
        return jsend.success(true);
    });
};
module.exports.autoPrefix = '/api/config/';
