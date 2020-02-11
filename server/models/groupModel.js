const Sequelize = require('sequelize');

module.exports.GroupDbModel = ["groups", {
    i_group: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    allowed_all: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}];
