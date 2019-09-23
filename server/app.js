'use strict'

const mongoose = require('mongoose');
const fastify = require('fastify')({
    logger: false
});
const fsequelize = require('fastify-sequelize');

const sequelizeConfig = {
    instance: 'sequelize',
    autoConnect: true,
    username: 'door-system',
    password: 'door123',
    database: 'door_system',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
};
mongoose.connect('mongodb://localhost:27017/door_system_monitoring')
    .then(() => console.log('MongoDB connected…'))
    .catch(err => console.log(err));


fastify.register(require('fastify-mysql'), {
    connectionString: 'mysql://door-system@localhost/door_system?password=door123'
});

fastify.register(fsequelize, sequelizeConfig);

fastify.register(require('fastify-cors'));

fastify.register(require('./controllers/cardController'), {logLevel: 'debug'});
fastify.register(require('./controllers/configController'), {logLevel: 'debug'});
fastify.register(require('./controllers/doorController'), {logLevel: 'debug'});
fastify.register(require('./controllers/groupController'), {logLevel: 'debug'});
fastify.register(require('./controllers/logsController'), {logLevel: 'debug'});


fastify.ready(err => {
    console.log(err)

});

fastify.listen(3000, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
});
