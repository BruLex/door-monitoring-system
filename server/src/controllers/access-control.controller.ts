import { FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';

import * as jsend from 'jsend';
import { Device, User } from '../models';

import { checkCard } from '../schemas';
import { AccessLoggerService } from '../services/access-logger.service';

@Controller({ route: '/access_control' })
export default class AccessControlController {
    @Inject(AccessLoggerService) private accessLogSrv!: AccessLoggerService;

    @POST({ url: '/check_card', options: { schema: checkCard } })
    async checkCard(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { ip, body } = request;
        const { uuid } = body;

        const devices: Device[] = await Device.findAll({ where: { ip } });
        const device: Device = devices[0];
        const users: User[] = await User.scope('extended_access_map').findAll({ where: { uuid } });
        const user: User = users[0];
        let error: string = null;

        if (devices.length !== 1) {
            error = 'Device IP is not recognized';
        } else if (users.length !== 1) {
            error = 'UUID is not registered';
        } else if (!user.i_role) {
            error = 'Role for user not specified';
        } else if (user.role.allowed_devices.every(({ i_device }) => i_device !== device.i_device)) {
            error = 'Device not in scope of allowed for your role';
        }
        this.accessLogSrv.logAction({ user, device, ip, error, uuid }).then();
        if (error) {
            throw Error('Access denied, reason: ' + error);
        }
        return jsend.success(null);
    }
}
