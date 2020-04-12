import { FastifyInstance, FastifyRequest } from 'fastify';
import { Controller, FastifyInstanceToken, Inject, POST } from 'fastify-decorators';

import * as fs from 'fs';
import { promises } from 'fs';
import * as jsend from 'jsend';

import { getConfigsSchema, updateConfigsSchema } from '@schemas';

@Controller({ route: '/config' })
export default class ConfigController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @POST({ url: '/get_configs', options: { schema: getConfigsSchema } })
    async getConfigs(): Promise<jsend.JSendObject> {
        return jsend.success(JSON.parse(fs.readFileSync('../configs/config.json', { encoding: 'UTF-8' })));
    }

    @POST({ url: '/update_configs', options: { schema: updateConfigsSchema } })
    async updateConfigs(request: FastifyRequest): Promise<void> {
        promises
            .writeFile('../server/configs/config.json', JSON.stringify(request.body, null, 2))
            .then((): jsend.JSendObject => jsend.success(true))
            .catch(jsend.error);
    }
}
