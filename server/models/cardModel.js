const Sequelize = require('sequelize')

module.exports.CardDbModel= ["cards", {
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

