'use strict'
const Sequelize = require('sequelize');

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
                    reply.send(err ? jsend.error(err) : jsend.success({i_device: result.insertId}))
                }
            )
        });
    });

    fastify.post('/api/group/get_group_info', async (req, reply) => {
        fastify.mysql.getConnection((err, client) => {
            if (err) return reply.send(jsend.error(err));
            client.query(
                'SELECT * FROM `groups` as g left join group_device_permisions as gp on g.i_group = gp.i_group where g.i_group = ?',
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
                        i_device: res.i_device,
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
        const Group = fastify.sequelize.define(...fastify.groupModel);
        const resp = await Promise.all(await Group.findAll().map(async group => {
            const group_item = { i_group: group.i_group, name: group.name };

            if (Boolean(req.body.with_extended_info)) {
                group_item.users = await fastify.sequelize.query(`
                SELECT users.i_user, users.name, users.uuid
                FROM users inner join group_users gu on users.i_user = gu.i_user
                where gu.i_group=${group.i_group}
                `, { type: Sequelize.QueryTypes.SELECT });
                group_item.allowed_devices = await fastify.sequelize.query(`
                SELECT d.i_device, d.name, d.description, d.ip
                FROM devices d inner join group_device_permisions gdp on d.i_device = gdp.i_device
                where gdp.i_group=${group.i_group}
                `, { type: Sequelize.QueryTypes.SELECT });
            }
            return group_item
        }));
        return jsend.success({ group_list: resp });

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
                            make_query('DELETE FROM group_device_permisions WHERE i_group = ' + req.body.i_group);
                        } else if (req.body.permissions.length) {
                            const permission = req.body.permissions.pop();
                            make_query('INSERT INTO group_device_permisions VALUES(null,'
                                + req.body.i_group + ',' + permission.i_device + ',' + permission.acl + ');'
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
