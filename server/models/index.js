const Sequelize = require('sequelize');
const config = require('../../../../config.js');
const sequelize = new Sequelize(config.get('database'), 'root', 'root123', {
    host: config.get('database_url'),
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: false,
    },
    logging: false,
});
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    LogRequests: require('./logModel.js')(sequelize, Sequelize),
};
