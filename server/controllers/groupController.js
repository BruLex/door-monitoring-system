'use strict';

const Sequelize = require('sequelize');
const jsend = require('jsend');

module.exports = async (fastify, options) => {
    const Group = fastify.sequelize.define(...fastify.groupModel);

    fastify.post('add_group', async (req, reply) => {
        const groupResult = await Group.create({ name: req.body.name, allowed_all: req.body.allowed_all ? 1 : 0 });
        const i_group = groupResult.dataValues.i_group;
        if (!req.body.allowed_all && !!req.body.allowed_devices) {
            for (let index = 0; index < req.body.allowed_devices.length; index++) {
                const i_device = req.body.allowed_devices[index].i_device;
                await fastify.sequelize.query(
                    `INSERT INTO group_device_permisions VALUES(null, ${i_group}, ${i_device});`
                );
            }
        }
        return jsend.success({ i_group });
    });

    fastify.post('get_group_info', async (req, reply) => {
        return await Group.findByPk(req.body.i_group).then(group_info => jsend.success({ group_info }));
    });

    fastify.post('get_group_list', async (req, reply) => {
        const group_list = await Promise.all(
            await Group.findAll().map(async group => {
                const group_item = {
                    i_group: group.i_group,
                    name: group.name,
                    allowed_all: Boolean(group.allowed_all),
                };

                if (req.body && Boolean(req.body.with_extended_info)) {
                    group_item.users = await fastify.sequelize.query(
                        `
                SELECT u.i_user, u.name, u.uuid
                FROM users u
                where u.i_group=${group.i_group}
                `,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                    group_item.allowed_devices = await fastify.sequelize.query(
                        `
                SELECT d.i_device, d.name, d.description, d.ip
                FROM devices d inner join group_device_permisions gdp on d.i_device = gdp.i_device
                where gdp.i_group=${group.i_group}
                `,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                }
                return group_item;
            })
        );
        return jsend.success({ group_list });
    });

    fastify.post('update_group', async (req, reply) => {
        await Group.update(
            { name: req.body.name, allowed_all: req.body.allowed_all ? 1 : 0 },
            { where: { i_group: req.body.i_group } }
        );
        await fastify.sequelize.query(`DELETE FROM group_device_permisions WHERE i_group = ${req.body.i_group}`);
        if (!req.body.allowed_all && !!req.body.allowed_devices) {
            for (let index = 0; index < req.body.allowed_devices.length; index++) {
                const i_device = req.body.allowed_devices[index].i_device;
                await fastify.sequelize.query(
                    `INSERT INTO group_device_permisions VALUES(null, ${req.body.i_group}, ${i_device});`
                );
            }
        }
        return jsend.success(null);
    });

    fastify.post('delete_group', async (req, reply) => {
        if (req.body.multiple && !!req.body.groups) {
            for (let index = 0; index < req.body.groups.length; index++) {
                await (await Group.findByPk(req.body.groups[index])).destroy();
            }
        } else {
            await (await Group.findByPk(req.body.i_group)).destroy();
        }
        return jsend.success(null);
    });
};

module.exports.autoPrefix = '/api/group/';
