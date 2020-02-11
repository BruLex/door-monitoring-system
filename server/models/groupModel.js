const Sequelize = require('sequelize');

module.exports.GroupDbModel = ["groups", {
    i_group: {
        type: Sequelize.INTEGER,
        groupautoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    access_all: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
}];
