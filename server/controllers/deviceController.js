'use strict';

const jsend = require('jsend');

module.exports = async (fastify, options) => {
    const Device = fastify.sequelize.define(...fastify.deviceModel);

    fastify.post('add_device', async (req, reply) => {
        return Device.create(req.body)
                .then(({ i_device }) => jsend.success({ i_device }))
                .catch(err => jsend.error(err.errmsg));
    });
    fastify.post('get_device_info', async (req, reply) => {
        return await Device.findByPk(req.body.i_user).then(device_info => jsend.success({ device_info }));
    });
    fastify.post('get_device_list', async (req, reply) => {
        return await Device.findAll().then(device_list => jsend.success({ device_list }));
    });
    fastify.post('update_device', async (req, reply) => {
        await Device.update(
                {
                    name: req.body.name,
                    description: req.body.description,
                    ip: req.body.ip,
                },
                { where: { i_device: req.body.i_device } },
        );
        return jsend.success(null);
    });
    fastify.post('delete_device', async (req, reply) => {
        if (req.body.multiple && !!req.body.devices) {
            for (let index = 0; index < req.body.devices.length; index++) {
                await (await Device.findByPk(req.body.devices[index])).destroy();
            }
        } else {
            await (await Device.findByPk(req.body.i_device)).destroy();
        }
        return jsend.success(null);
    });
};
module.exports.autoPrefix = '/api/device/';
