import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Controller, FastifyInstanceToken, Inject, POST } from 'fastify-decorators';

import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';
import { DeviceControlService } from 'src/services/device-control.service';
import { Constants } from 'src/shared/constants';
import { LockMode } from 'src/shared/types';
import * as ip from 'ip';
import { v4 as uuidv4 } from 'uuid';

import { Device } from '../models';
import {
    addDeviceSchema,
    deleteDeviceSchema,
    getDeviceInfoSchema,
    getDeviceListSchema,
    updateDeviceSchema
} from '../schemas';
export { Constants } from '../shared/constants';

@Controller({ route: '/device' })
export default class DeviceController {
    @Inject(DeviceControlService) private deviceCtrlSrv!: DeviceControlService;

    @POST({ url: '/add_device', options: { schema: addDeviceSchema } })
    async addDevice(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { body } = request;
        // this.deviceCtrlSrv.applyConfig({
        //     deviceIp: body.ip,
        //     deviceMode: body.mode || LockMode.Guard,
        //     generateToken: true
        // });
        return jsend.success({ i_device: (await Device.create(body)).i_device });
    }

    @POST({ url: '/get_device_info', options: { schema: getDeviceInfoSchema } })
    async getDeviceInfo(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const { i_device, with_device_status }: any = request.body;
        const device_info: Device = await Device.findByPk(i_device);
        if (!device_info) {
            reply.code(500).send(jsend.error(`Device with i_device: ${i_device} not found`));
            return reply;
        }
        if (with_device_status) {
            device_info.status = await this.deviceCtrlSrv.pingDevice(device_info.ip);
        }
        return jsend.success({ device_info });
    }

    @POST({ url: '/get_device_list', options: { schema: getDeviceListSchema } })
    async getDeviceList(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { with_device_status }: any = request.body;
        const device_list: Device[] = await Device.findAll();
        if (with_device_status && device_list.length) {
            for (const device of device_list) {
                device.status = await this.deviceCtrlSrv.pingDevice(device.ip);
            }
        }
        return jsend.success({ device_list });
    }

    @POST({ url: '/update_device', options: { schema: updateDeviceSchema } })
    async updateDevice(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const body: any = request.body;
        const device_info: Device = await Device.findByPk(body.i_device);
        if (!device_info) {
            reply.code(404).send(jsend.error(`Device with i_device: ${body.i_device} not found`));
            return reply;
        }
        Object.keys(_.pick(body, ['name', 'description', 'ip', 'mode'])).forEach(
            (key: string): any => (device_info[key] = body[key])
        );
        if (body.mode) {
            console.log(device_info.token);
            console.log(device_info.token || Constants.defaultToken);
            await this.deviceCtrlSrv.applyConfig({
                deviceIp: device_info.ip,
                deviceMode: device_info.mode,
                token: device_info.token || Constants.defaultToken
            });
        }
        device_info.save();
        return jsend.success(null);
    }

    @POST({ url: '/delete_device', options: { schema: deleteDeviceSchema } })
    async deleteDevice(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { devices, i_device }: any = request.body;
        if (devices && i_device) {
            throw new Error('Should be specified only one property(i_device or devices) for deletion');
        }
        if (!devices && !i_device) {
            throw new Error('Should be specified at least one property(i_device or devices) for deletion');
        }
        const queryInterface: QueryInterface = Device.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(Device.tableName, {
            i_device: { [Op.in]: devices || [i_device] }
        });
        return jsend.success(null);
    }
}
