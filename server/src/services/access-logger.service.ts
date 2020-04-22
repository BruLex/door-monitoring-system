import { Service } from 'fastify-decorators';
import { Device, Log, User } from 'src/models';

@Service()
export class AccessLoggerService {
    async logAction(options: {
        user?: User;
        device?: Device;
        ip?: string;
        uuid?: string;
        error?: string;
    }): Promise<void> {
        const log: Log = new Log({
            device_ip: options.device?.ip || options.ip,
            device_name: options.device?.name || 'N/D',
            i_device: options.device?.i_device,
            i_role: options?.user?.i_role,
            role_name: options?.user?.role?.name || 'N/D',
            access: !options.error,
            time: new Date(),
            error: options.error,
            i_user: options?.user?.i_user,
            user_name: options?.user?.name || 'N/D',
            uuid: options?.user?.uuid || options.uuid || 'N/D'
        });

        log.save();
    }
}
