import { FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';

import * as jsend from 'jsend';

import { Device, Card } from '../models';
import { AccessControlSchema } from '../schemas';
import { AccessLoggerService } from '../services/access-logger.service';

@Controller({ route: '/access_control' })
export class AccessControlController {
    @Inject(AccessLoggerService) private accessLogSrv!: AccessLoggerService;

    @POST({ url: '/check_card', options: { schema: AccessControlSchema.checkCard } })
    async checkCard(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { ip, body } = request;
        const { uuid } = body;

        const devices: Device[] = await Device.findAll({ where: { ip } });
        const device: Device = devices[0];
        const cards: Card[] = await Card.scope('extended_access_map').findAll({ where: { uuid } });
        const card: Card = cards[0];
        let error: string = null;

        if (devices.length !== 1) {
            error = 'Device IP is not recognized';
        } else if (cards.length !== 1) {
            error = 'UUID is not registered';
        } else if (!card.i_role) {
            error = 'Role for card not specified';
        } else if (card.role.allowed_devices.every(({ i_device }) => i_device !== device.i_device)) {
            error = 'Device not in scope of allowed for your role';
        }
        this.accessLogSrv.logAction({ card, device, ip, error, uuid }).then();
        if (error) {
            console.log(`Access denied, device_ip:${ip}, card:${uuid} reason: ` + error);
            throw Error('Access denied, reason: ' + error);
        }
        console.log(`Access granted, device_ip:${ip}, card:${uuid}`);

        return jsend.success(null);
    }
}
