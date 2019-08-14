'use strict'


module.exports = async function (fastify, opts) {

  fastify.get('/ping', async function (request, reply) {
    fastify.log.warn('server listening on')
    return 'this is an essxample'
  })

  fastify.get('/check_uid', async function (request, reply) {
    fastify.log.info(`ID:${request.query.uid} IP: ${request.ip}`)
    return 1
  })

  fastify.get('/get_allowed_uid', async function (request, reply) {
    fastify.log.info(`ID:${request.query.uid} IP: ${request.ip}`)
    return { uids: ["sagagasg", "121gsa", "sagfa"] };
  })
}

module.exports.autoPrefix = '/ctrl'
