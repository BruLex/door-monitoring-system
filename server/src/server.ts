import * as fastify from 'fastify';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import * as fastifyCors from 'fastify-cors';
import * as fastifyDecorators from 'fastify-decorators';
import * as oas from 'fastify-oas';
import * as wsPlugin from 'fastify-websocket';

import * as ip from 'ip';
import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import { merge } from 'lodash';
import 'reflect-metadata';
import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { ServerInstanceConfig } from 'src/shared/types';

import {
    AccessControlController,
    CardController,
    DeviceController,
    LogController,
    RoleController,
    SessionController
} from './controllers';
import { User, Session, Log, Device, Card, Role, RoleDevicePermission } from './models';
import { SessionService } from './services/session-service';

const DATABASE_MODELS: ModelCtor[] = [Role, User, Session, Log, Device, Card, RoleDevicePermission];
const CONTROLLERS: any[] = [
    AccessControlController,
    CardController,
    DeviceController,
    LogController,
    RoleController,
    SessionController
];

export class Server {
    readonly configuration: ServerInstanceConfig;
    private sequelize: Sequelize;
    private server: fastify.FastifyInstance;

    constructor(private config: ServerInstanceConfig = {}) {
        this.configuration = merge<ServerInstanceConfig, ServerInstanceConfig>(
            {
                database: {
                    database: 'door_system',
                    username: 'door',
                    password: 'door123',
                    sync: {
                        force: false,
                        alter: false
                    }
                },
                server: {
                    ip: ip.address(),
                    port: 3000,
                    logger: {
                        level: 'info'
                    }
                }
            },
            config
        );
    }

    init(): this {
        this.server = fastify({
            logger: this.configuration.server.logger
        });
        this.server.decorate('serverConfig', this.configuration);
        this.sequelize = new Sequelize({
            dialect: 'mysql',
            define: { timestamps: false },
            logging: (sql) => this.server.log.info(sql),
            models: DATABASE_MODELS,
            ...this.configuration.database
        });
        this.registerPlugins();
        this.setupHandlers();
        return this;
    }

    async start(): Promise<void> {
        await this.sequelize.sync();
        await this.server.listen(this.configuration.server.port, '0.0.0.0');
    }

    private registerPlugins(): void {
        this.server.register(oas, {
            routePrefix: '/docs',
            exposeRoute: true,
            swagger: {
                info: {
                    title: 'Door system monitoring API',
                    version: '1.0.0'
                },
                servers: [{ url: 'http://localhost:' + this.configuration.server.port, description: 'development' }],
                schemes: ['http'],
                consumes: ['application/json'],
                produces: ['application/json']
            }
        });

        this.server.register(wsPlugin, {
            options: {
                clientTracking: true,
                maxPayload: 1048576
            }
        });

        this.server.register(fastifyDecorators.bootstrap, {
            controllers: CONTROLLERS
        });

        this.server.register(fastifyCors, {
            origin: 'http://127.0.0.1:4200',
            credentials: true
        });
    }

    private setupHandlers(): void {
        this.server.ready((err: Error): void => {
            if (err) {
                this.server.log.error('READY ERROR:', err);
                console.log('READY ERROR:', err);
            }
            console.log('ROUTES::', this.server.printRoutes());
        });
        this.server.addHook('preHandler', SessionService.checkSID);
        this.server.setErrorHandler(
            (error: FastifyError, request: FastifyRequest, reply: FastifyReply<ServerResponse>) =>
                reply.code(error.statusCode || 500).send(jsend.error({ message: error.message }))
        );

        this.server.setNotFoundHandler(
            (request: FastifyRequest, reply: FastifyReply<ServerResponse>): fastify.FastifyReply<ServerResponse> =>
                reply.code(404).send(jsend.error({ message: 'Not found' }))
        );
        process.on('uncaughtException', (error: Error): void => console.error(error));
        process.on('unhandledRejection', (error: Error): void => console.error(error));
    }
}
