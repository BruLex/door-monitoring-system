'use strict'

const jsend = require('jsend');
module.exports = async (fastify, options) => {

    fastify.post('/api/door/add_door', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'INSERT INTO doors VALUES (?,?,?,?)',
                [null, req.body.name, req.body.description, req.body.ip],
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success({i_door: result.insertId}))
                }
            )
        });
    });

    fastify.post('/api/door/get_door_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM doors WHERE i_door = ?',
                [req.body.i_door],
                (err, result) => {
                    client.release();
                    console.log(result)
                    reply.send(err
                        ? jsend.error(err)
                        : !result.length
                            ? jsend.error('Record not found')
                            : jsend.success({door_info: result[0]}))
                }
            )
        });
    });

    fastify.post('/api/door/get_door_list', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM doors',
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success({door_list: result}))
                }
            )
        });
    });


    fastify.post('/api/door/update_door_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'UPDATE doors SET name = ?, description = ?, ip = ? WHERE i_door = ?',
                [req.body.name, req.body.description, req.body.ip, req.body.i_door],
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success(true))
                }
            )
        });
    });

    fastify.post('/api/door/delete_door', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'DELETE FROM doors WHERE i_door = ?',
                [req.body.i_door],
                (err, result) => {
                    client.release();
                    reply.send(err
                        ? jsend.error(err)
                        : !result.affectedRows
                            ? jsend.error('Wrong i_door')
                            : jsend.success(true))
                }
            )
        });
    });
};
