import { Service } from 'fastify-decorators';

import { Device, Log, Card } from 'src/models';

@Service()
export class AccessLoggerService {
    async logAction(options: {
        card?: Card;
        device?: Device;
        ip?: string;
        uuid?: string;
        error?: string;
    }): Promise<void> {
        const log: Log = new Log({
            device_ip: options.device?.ip || options.ip,
            device_name: options.device?.name || 'N/D',
            i_device: options.device?.i_device,
            i_role: options?.card?.i_role,
            role_name: options?.card?.role?.name || 'N/D',
            access: !options.error,
            time: new Date(),
            error: options.error,
            i_card: options?.card?.i_card,
            card_name: options?.card?.name || 'N/D',
            uuid: options?.card?.uuid || options.uuid || 'N/D'
        });

        log.save();
    }
}
