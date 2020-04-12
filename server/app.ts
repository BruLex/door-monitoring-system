import * as models from '@models';
import * as fastify from 'fastify';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as path from 'path';
import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';

const sequelize: Sequelize = new Sequelize('door_system', 'door', 'door123', {
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    models: Object.values(models)
});

const server: fastify.FastifyInstance = fastify({ logger: true });

server.register(require('fastify-oas'), {
    routePrefix: '/docs',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'Door system monitoring API',
            version: '1.0.0'
        },
        servers: [{ url: 'http://localhost:3000', description: 'development' }],
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
    }
});

server.register(bootstrap, {
    directory: path.join(__dirname, 'controllers'),
    mask: /\.controller\./
});
server.register(require('fastify-cors'));

server.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply<ServerResponse>) =>
    reply.code(error.statusCode || 500).send(jsend.error({ message: error.message }))
);

server.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply<ServerResponse>) =>
    reply.code(404).send(jsend.error({ message: 'Not found' }))
);

server.ready((err) => {
    if (err) {
        console.log('READY ERROR:', err);
    }
    console.log('Routes:', server.printRoutes());
});

const start = async () => {
    try {
        await sequelize.sync({ force: false, alter: false });
        await server.listen(3000, '::');
    } catch (err) {
        console.log(err);
        server.log.error(err);
        process.exit(1);
    }
};

process.on('uncaughtException', (error) => console.error(error));
process.on('unhandledRejection', (error) => console.error(error));

start();
