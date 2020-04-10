import { Log } from '@models';
import { FastifyInstance } from 'fastify';
import { ALL, Controller, FastifyInstanceToken, Inject } from 'fastify-decorators';
import * as jsend from 'jsend';

@Controller({ route: '/logs' })
export default class LogController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @ALL({ url: '/get_system_logs' })
    async getLogs(): Promise<jsend.JSendObject> {
        return jsend.success({ logs: await Log.findAll() });
    }
}
