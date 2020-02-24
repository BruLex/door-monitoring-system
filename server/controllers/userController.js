'use strict';

const jsend = require('jsend');

module.exports = async (fastify, options) => {
    const User = fastify.sequelize.define(...fastify.userModel);

    fastify.post('add_user', async (req, reply) => {
        return User.create(req.body)
            .then(obj => jsend.success({ i_user: obj.i_user }))
            .catch(err => jsend.error(err.errmsg));
    });
    fastify.post('get_user_info', async (req, reply) => {
        return await User.findByPk(req.body.i_user).then(user_info => jsend.success({ user_info }));
    });
    fastify.post('get_user_list', async (req, reply) => {
        return await User.findAll().then(user_list => jsend.success({ user_list }));
    });
    fastify.post('update_user', async (req, reply) => {
        await User.update(
            {
                uuid: req.body.uuid,
                name: req.body.name,
                i_group: req.body.i_group,
            },
            { where: { i_user: req.body.i_user } }
        );
        return jsend.success(null);
    });
    fastify.post('delete_user', async (req, reply) => {
        if (req.body.multiple && !!req.body.users) {
            for (let index = 0; index < req.body.users.length; index++) {
                await (await User.findByPk(req.body.users[index])).destroy();
            }
        } else {
            await (await User.findByPk(req.body.i_user)).destroy();
        }
        return jsend.success(null);
    });
};

module.exports.autoPrefix = '/api/user/';
