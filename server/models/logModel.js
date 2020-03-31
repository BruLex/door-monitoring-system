const Sequelize = require('sequelize');

module.exports.LogDbModel = [
    'logs',
    {
        i_log: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        i_device: { type: Sequelize.INTEGER },
        i_group: { type: Sequelize.INTEGER },
        i_user: { type: Sequelize.INTEGER },
        time: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        access: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        device_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        group_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        device_ip: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
];
