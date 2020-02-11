'use strict'

const jsend = require('jsend');
module.exports = async (fastify, options) => {

    fastify.post('/api/device/add_device', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'INSERT INTO devices VALUES (?,?,?,?)',
                [null, req.body.name, req.body.description, req.body.ip],
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success({i_device: result.insertId}))
                }
            )
        });
    });

    fastify.post('/api/device/get_device_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM devices WHERE i_device = ?',
                [req.body.i_device],
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

    fastify.post('/api/device/get_device_list', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM devices',
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success({device_list: result}))
                }
            )
        });
    });


    fastify.post('/api/device/update_device_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'UPDATE devices SET name = ?, description = ?, ip = ? WHERE i_device = ?',
                [req.body.name, req.body.description, req.body.ip, req.body.i_device],
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success(true))
                }
            )
        });
    });

    fastify.post('/api/device/delete_device', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'DELETE FROM devices WHERE i_device = ?',
                [req.body.i_device],
                (err, result) => {
                    client.release();
                    reply.send(err
                        ? jsend.error(err)
                        : !result.affectedRows
                            ? jsend.error('Wrong i_device')
                            : jsend.success(true))
                }
            )
        });
    });
};
