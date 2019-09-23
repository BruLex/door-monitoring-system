'use strict'
const jsend = require('jsend');

const Sequelize = require('sequelize');

const Log = ["logs", {
    i_log: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    i_card: {
        type: Sequelize.STRING,
        allowNull: false
    },
    i_door: {type: Sequelize.INTEGER},
    i_group: {type: Sequelize.INTEGER},
    i_user: {type: Sequelize.INTEGER},
    time: {
        type: Sequelize.DATE,
        allowNull: false
    },
    access: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}];

const Card = ["cards", {
    i_card: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false
    }
}];

module.exports = async (fastify, options) => {

    fastify.post('/api/logs/get_system_logs', async (req, reply) => {
        const logDB = fastify.sequelize.define(...Log);
        const cardDB = fastify.sequelize.define(...Card);
        const resp = await Promise.all(await logDB.findAll().map(async log => {
            const card_info = await cardDB.findByPk(log.i_card);
            return {
                i_log: log.i_log,
                card_info: card_info ? {
                    i_card: card_info.i_card,
                    uid: card_info.uid
                } : null,
                door_info: null ? {
                    i_door: log.i_door,
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
