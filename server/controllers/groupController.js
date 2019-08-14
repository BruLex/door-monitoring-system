'use strict'


const jsend = require('jsend');
module.exports = async (fastify, options) => {

    fastify.post('/api/group/add_group', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'INSERT INTO `groups` VALUES (?,?)',
                [null, req.body.name],
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success({i_door: result.insertId}))
                }
            )
        });
    });

    fastify.post('/api/group/get_group_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM `groups` as g left join `group_door_permisions` as gp on g.i_group = gp.i_group where g.i_group = ?',
                [req.body.i_group],
                (err, results) => {
                    client.release();
                    console.log(results)
                    const group_info = {
                        i_group: results[0].i_group,
                        name: results[0].name,
                        permissions: []
                    };
                    results.forEach(res => group_info.permissions.push({
                        i_door: res.i_door,
                        acl: res.acl,
                    }));
                    reply.send(err
                        ? jsend.error(err)
                        : !results.length
                            ? jsend.error('Record not found')
                            : jsend.success({group_info: group_info}))
                }
            )
        });
    });

    fastify.post('/api/group/get_group_list', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM groups',
                (err, result) => {
                    client.release();
                    reply.send(err ? jsend.error(err) : jsend.success({door_list: result}))
                }
            )
        });
    });


    fastify.post('/api/group/update_group_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            let flag = true;
            const make_query = (query) => {
                client.query(query, (err, result) => {
                        if (err) {
                            reply.send(jsend.error(err));
                        } else if (flag) {
                            flag = false;
                            make_query('DELETE FROM group_door_permisions WHERE i_group = ' + req.body.i_group);
                        } else if (req.body.permissions.length) {
                            const permission = req.body.permissions.pop();
                            make_query('INSERT INTO group_door_permisions VALUES(null,'
                                + req.body.i_group + ',' + permission.i_door + ',' + permission.acl + ');'
                            );
                        } else {
                            reply.send(jsend.success(true))
                        }
                    }
                )
            };
            make_query('UPDATE `groups` SET name = \"' + req.body.name + '\" WHERE i_group = ' + req.body.i_group);
        });
    });

    fastify.post('/api/group/delete_group', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query('DELETE FROM `groups` WHERE i_group = ' + req.body.i_group,
                (err, result) => {
                    reply.send(err ? jsend.error(err) : jsend.success(true))
                }
            )
        });
    });
};
