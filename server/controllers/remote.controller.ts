import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';

@Controller({ route: '/remote' })
export default class RemoteController {
    @POST({ url: '/check_uid' })
    async checkUID(request: FastifyRequest, reply: FastifyReply<number>): Promise<number> {
        return 2;
    }

    @POST({ url: '/get_allowed_uid' })
    async getAllowedUID(request: FastifyRequest) {
        console.log(`ID:${request.query.uid} IP: ${request.ip}`);
        return { uid_list: ['sagsagasg', '121gsa', 'sagfa'] };
    }

    @POST({ url: '/register_device' })
    async registerDevice(request: FastifyRequest) {
        console.log(`ID:${request.query.uid} IP: ${request.ip}`);
        console.log(request.body);
        return { uid_list: ['sagagasg', '121gsa', 'sagfa'] };
    }
}
