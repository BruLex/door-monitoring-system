'use strict';

const fastify = require('fastify')({
    logger: true,
});
const fsequelize = require('fastify-sequelize');
const AutoLoad = require('fastify-autoload');
const path = require('path');

const sequelizeConfig = {
    instance: 'sequelize',
    autoConnect: true,
    username: 'door',
    password: 'door123',
    database: 'door_system',
    dialect: 'mysql',
    define: {
        timestamps: false,
    },
};

fastify.register(fsequelize, sequelizeConfig);

fastify.decorate('logModel', require('./models/logModel').LogDbModel);
fastify.decorate('groupModel', require('./models/groupModel').GroupDbModel);
fastify.decorate('userModel', require('./models/userModel').UserDbModel);
fastify.decorate('deviceModel', require('./models/deviceModel').DeviceDbModel);


fastify.register(require('fastify-cors'));

fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'controllers'),
    // options: { logLevel: 'debug' },
});

fastify.ready(err => {
    console.log('Ready:', err);
});
console.log(fastify.printRoutes());

fastify.listen(3000, '::', (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening on ${ address }`);
});
