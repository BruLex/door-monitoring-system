import { getConfigsSchema, updateConfigsSchema } from '@schemas';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Controller, FastifyInstanceToken, Inject, POST } from 'fastify-decorators';
import * as fs from 'fs';
import { promises } from 'fs';
import * as jsend from 'jsend';

@Controller({ route: '/config' })
export default class ConfigController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @POST({ url: '/get_configs', options: { schema: getConfigsSchema } })
    async getConfigs() {
        return jsend.success(JSON.parse(fs.readFileSync('../configs/config.json', { encoding: 'UTF-8' })));
    }

    @POST({ url: '/update_configs', options: { schema: updateConfigsSchema } })
    async updateConfigs(request: FastifyRequest) {
        promises.writeFile('../server/configs/config.json', JSON.stringify(request.body, null, 2))
            .then(() => jsend.success(true))
            .catch(jsend.error);
    }
}
