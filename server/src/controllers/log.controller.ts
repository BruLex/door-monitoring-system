import { Controller, POST } from 'fastify-decorators';

import * as jsend from 'jsend';

import { Log } from '../models';
import { LogSchema } from '../schemas/log.schema';
import { SessionService } from '../services/session-service';

@Controller({ route: '/logs' })
export class LogController {
    @POST({
        url: '/get_system_logs',
        options: { schema: LogSchema.getSystemLogsSchema }
    })
    async getLogs(): Promise<jsend.JSendObject> {
        return jsend.success({ logs: await Log.findAll() });
    }
}
