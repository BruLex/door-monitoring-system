import { FastifyReply, FastifyRequest } from 'fastify';
import { ALL, Controller, POST } from 'fastify-decorators';

import * as jsend from 'jsend';

@Controller({ route: '/remote' })
export default class RemoteController {
    @ALL({ url: '/check_uid' })
    async checkUID(request: FastifyRequest, reply: FastifyReply<number>): Promise<jsend.JSendObject> {
        if (request.body.uid === '0a049016') {
            return jsend.success({ access_granted: true });
        } else {
            return jsend.error({ message: 'No granted', data: { access_granted: false } });
        }
    }

    @POST({ url: '/get_allowed_uid' })
    async getMyConfigs(request: FastifyRequest): Promise<string> {
        console.log(request.ip);
        return request.ip;
    }

    @POST({ url: '/register_device' })
    async registerDevice(request: FastifyRequest): Promise<{ uid_list: string[] }> {
        console.log(`ID:${request.query.uid} IP: ${request.ip}`);
        console.log(request.body);
        return { uid_list: ['sagagasg', '121gsa', 'sagfa'] };
    }
}
