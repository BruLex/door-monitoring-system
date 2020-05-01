import { Controller, POST } from 'fastify-decorators';

import * as jsend from 'jsend';

import { Log } from '../models';

@Controller({ route: '/logs' })
export class LogController {
    @POST({ url: '/get_system_logs' })
    async getLogs(): Promise<jsend.JSendObject> {
        return jsend.success({ logs: await Log.findAll() });
    }
}
