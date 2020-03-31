const jsend = require('jsend');

module.exports = async (fastify, options) => {
    const Log = fastify.sequelize.define(...fastify.logModel);
    fastify.all('get_system_logs', async () => {
        return Log.findAll().then(logs => jsend.success({ logs }))();
    });
};
module.exports.autoPrefix = '/api/logs/';
