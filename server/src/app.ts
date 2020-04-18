import * as fastify from 'fastify';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import * as fastifyDecorators from 'fastify-decorators';
import * as fastifyCors from 'fastify-cors';
import * as fastifyOas from 'fastify-oas';

import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as path from 'path';
import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';

import * as models from './models';

const sequelize: Sequelize = new Sequelize('door_system', 'door', 'door123', {
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    logging: true,
    models: Object.values(models)
});

const server: fastify.FastifyInstance = fastify({
    logger: {
        level: 'info'
    }
});

server.register(fastifyOas, {
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

server.register(fastifyDecorators.bootstrap, {
    directory: path.join(__dirname, 'controllers'),
    mask: /\.controller\./
});

server.register(fastifyCors);

server.setErrorHandler(
    (
        error: FastifyError,
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): fastify.FastifyReply<ServerResponse> =>
        reply.code(error.statusCode || 500).send(jsend.error({ message: error.message }))
);

server.setNotFoundHandler(
    (request: FastifyRequest, reply: FastifyReply<ServerResponse>): fastify.FastifyReply<ServerResponse> =>
        reply.code(404).send(jsend.error({ message: 'Not found' }))
);

server.ready((err: Error): void => {
    if (err) {
        server.log.error('READY ERROR:', err);
    }
    console.log('ROUTES::', server.printRoutes());
});

const start: () => Promise<void> = async (): Promise<void> => {
    try {
        await sequelize.sync({
            force: false,
            alter: false
        });
        await server.listen(3000, '0.0.0.0');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

process.on('uncaughtException', (error: Error): void => console.error(error));
process.on('unhandledRejection', (error: {} | null | undefined): void => console.error(error));

start();