const remoteControlSchema = require('../schemas/remoteControl');

module.exports = async function(fastify, opts) {
    fastify.post('/check_uid', { schema: remoteControlSchema.checkUID }, async function(request, reply) {
        return 1;
    });

    fastify.get('/get_allowed_uid', async function(request, reply) {
        fastify.log.info(`ID:${request.query.uid} IP: ${request.ip}`);
        return { uid_list: ['sagagasg', '121gsa', 'sagfa'] };
    });
    fastify.post('/register_device', async function(request, reply) {
        console.log(`ID:${request.query.uid} IP: ${request.ip}`);
        console.log(request.body);
        return { uid_list: ['sagagasg', '121gsa', 'sagfa'] };
    });
};

module.exports.autoPrefix = '/remote';
