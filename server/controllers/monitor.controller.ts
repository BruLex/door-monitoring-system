import { FastifyInstance, FastifyRequest } from 'fastify';
import { ALL, Controller, FastifyInstanceToken, Inject } from 'fastify-decorators';

@Controller({ route: '/monitor' })
export default class MonitorController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @ALL({ url: '/list' })
    getDeviceInfo(request: FastifyRequest): string {
        return 'this is an example';
    }
}

