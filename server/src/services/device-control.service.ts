import { FastifyInstance } from 'fastify';
import { FastifyInstanceToken, Inject, Service } from 'fastify-decorators';

import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import { URLSearchParams } from 'url';
import { v4 as uuid } from 'uuid';

import { Constants, DeviceApiEndpoints } from '../shared/constants';
import { ApplyConfigOptions, DeviceConfig, ServerInstanceConfig } from '../shared/types';

@Service()
export class DeviceControlService {
    @Inject(FastifyInstanceToken) private instance: FastifyInstance & { serverConfig: ServerInstanceConfig };

    async pingDevice(deviceIp: string): Promise<boolean> {
        const client: AxiosInstance = axios.create({
            baseURL: 'http://' + deviceIp,
            responseType: 'json',
            timeout: Constants.defaultTimeout
        });
        try {
            const pingResult: AxiosResponse = await client.post<{ status: boolean }>(DeviceApiEndpoints.Ping);
            return pingResult?.data?.status === 'success';
        } catch (e) {
            return false;
        }
    }

    async applyConfig(options: ApplyConfigOptions): Promise<{ success: boolean; token: string }> {
        const { deviceIp, deviceMode, generateToken = false, token = Constants.defaultToken } = options;
        if (!(await this.pingDevice(deviceIp))) {
            console.error('Cannot update config for not active device');
        }

        const config: DeviceConfig = {
            mode: deviceMode,
            server_address: this.instance.serverConfig.server.ip + ':' + this.instance.serverConfig.server.port,
            token
        };

        console.log('serverConfig', (this.instance as any).serverConfig);

        if (generateToken) {
            config.token = uuid();
        }
        const params: URLSearchParams = new URLSearchParams();
        Object.keys(config).forEach((field) => params.append(field, config[field]));
        console.log(params);
        console.log({ TOKEN: token });

        const client: AxiosInstance = axios.create({
            baseURL: 'http://' + deviceIp,
            responseType: 'json',
            timeout: Constants.defaultTimeout,
            headers: { TOKEN: token }
        });
        try {
            const pingResult: AxiosResponse = await client.post<{ status: boolean }>(
                DeviceApiEndpoints.UpdateConfig,
                params
            );
            if (pingResult?.data?.status !== 'success') {
                console.error('Cannot recognize answer');
                return { success: false, token };
            }
        } catch (e) {
            console.error('Cannot update config for device');
            return { success: false, token };
        }
        return { success: true, token: config.token };
    }
}
