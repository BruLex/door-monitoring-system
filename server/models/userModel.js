const Sequelize = require('sequelize');

module.exports.UserDbModel = [
    'users',
    {
        i_user: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        i_group: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
];
