'use strict';

module.exports = async function(fastify, opts) {
    fastify.get('/:id', async function(request, reply) {
        fastify.log.warn('server listening on');
        return 'this is an essxample';
    });

    fastify.post('/lsit', async function(request, reply) {
        return 'this is an example';
    });
};

module.exports.autoPrefix = '/monitor';
