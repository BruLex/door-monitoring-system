import { FastifyInstance } from 'fastify';
import { Controller, FastifyInstanceToken, Inject, POST } from 'fastify-decorators';

import * as jsend from 'jsend';

import { Log } from '@models';

@Controller({ route: '/logs' })
export default class LogController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @POST({ url: '/get_system_logs' })
    async getLogs(): Promise<jsend.JSendObject> {
        return jsend.success({ logs: await Log.findAll() });
    }
}
