const fastify = require('fastify')();

fastify.register(require('fastify-mysql'), {
    connectionString: 'mysql://door-system@localhost/door_system?password=root',
    password: 'door123'
})

fastify.get('/user/:id', (req, reply) => {
    fastify.mysql.getConnection(onConnect)

    function onConnect (err, client) {
        if (err) return reply.send(err)

        client.query(
            'SELECT * FROM student',
            function onResult (err, result) {
                client.release()
                reply.send(err || result)
            }
        )
    }
})

fastify.listen(3000, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})
