const Sequelize = require('sequelize');

module.exports.DeviceDbModel = [
    'device',
    {
        i_device: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ip: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
];
