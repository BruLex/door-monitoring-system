'use strict'

const fastify = require('fastify')({
    logger: false
});
const fsequelize = require('fastify-sequelize');
const AutoLoad = require('fastify-autoload');
const path = require('path');

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

fastify.register(require('fastify-mysql'), {
    connectionString: 'mysql://door-system@localhost/door_system?password=door123'
});

fastify.register(fsequelize, sequelizeConfig);

fastify.decorate('cardModel', require('./models/cardModel').CardDbModel);
fastify.decorate('logModel', require('./models/logModel').LogDbModel);
fastify.decorate('groupModel', require('./models/groupModel').GroupDbModel);
fastify.decorate('userModel', require('./models/userModel').UserDbModel);


fastify.register(require('fastify-cors'));

fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'controllers'),
    options: { logLevel: 'debug' }
});

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
