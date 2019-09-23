'use strict'


module.exports = async function (fastify, opts) {

  fastify.post('/check_uid', async function (request, reply) {
    fastify.log.info(`ID:${request.query.uid} IP: ${request.ip}`)
    return {uid: request.body.uid}
  })

  fastify.get('/get_allowed_uid', async function (request, reply) {
    fastify.log.info(`ID:${request.query.uid} IP: ${request.ip}`)
    return { uids: ["sagagasg", "121gsa", "sagfa"] };
  })
}

module.exports.autoPrefix = '/remote'
