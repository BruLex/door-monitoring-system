import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import { Service } from 'fastify-decorators';
import { Constants } from '../controllers/device.controller';
import { DeviceApiEndpoints } from '../shared/constants';
import { DeviceConfig, LockMode } from '../shared/types';
import { URLSearchParams } from 'url';
import { v4 as uuid } from 'uuid';
import * as ip from 'ip';

@Service()
export class DeviceControlService {
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

    async applyConfig(options: {
        deviceIp: string;
        deviceMode: LockMode;
        generateToken?: boolean;
        token: string;
    }): Promise<string> {
        const { deviceIp, deviceMode, generateToken = false, token } = options;
        if (!(await this.pingDevice(deviceIp))) {
            throw Error('Cannot update config for not active device');
        }

        const config: DeviceConfig = {
            mode: deviceMode,
            server_address: ip.address() + ':' + 3000,
            token
        };

        if (generateToken) {
            config.token = uuid();
        }
        const params: URLSearchParams = new URLSearchParams();
        Object.keys(config).forEach((field) => params.append(field, config[field]));
        const client: AxiosInstance = axios.create({
            baseURL: 'http://' + deviceIp,
            responseType: 'json',
            timeout: Constants.defaultTimeout,
            headers: { TOKEN: config.token }
        });
        try {
            const pingResult: AxiosResponse = await client.post<{ status: boolean }>(
                DeviceApiEndpoints.UpdateConfig,
                params
            );
            if (pingResult?.data?.status !== 'success') {
                throw Error('error');
            }
        } catch (e) {
            console.log('error:' + e);
            throw Error('Cannot update config for device');
        }
        return config.token;
    }
}
