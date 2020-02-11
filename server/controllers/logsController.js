const jsend = require('jsend');

module.exports = async (fastify, options) => {
    const Card = fastify.sequelize.define(...fastify.cardModel);
    const Log = fastify.sequelize.define(...fastify.logModel);

    fastify.post('/api/logs/get_system_logs', async () => {
        const resp = await Promise.all(await Log.findAll().map(async log => {
            const card_info = await Card.findByPk(log.i_card);
            return {
                i_log: log.i_log,
                card_info: card_info ? {
                    i_card: card_info.i_card,
                    uid: card_info.uid
                } : null,
                door_info: null ? {
                    i_device: log.i_device,
                    name: ''
                } : null,
                group_info: null ?{
                    i_group: log.i_group,
                    name: ''
                } : null,
                user_info: null ?{
                    i_user: log.i_user,
                    name: ''
                } : null,
                time: log.time,
                access: log.access
            }
        }));
        return jsend.success({logs: resp});
    });
};
