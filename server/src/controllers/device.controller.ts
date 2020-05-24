import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';

import { ServerResponse } from 'http';
import * as ip from 'ip';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';

import { Device } from '../models';
import { DeviceSchema } from '../schemas';
import { DeviceControlService } from '../services/device-control.service';
import { LockMode } from '../shared/constants';

@Controller({ route: '/device' })
export class DeviceController {
    @Inject(DeviceControlService) private deviceControlService!: DeviceControlService;

    @POST({
        url: '/add_device',
        options: { schema: DeviceSchema.addDeviceSchema }
    })
    async addDevice(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { body } = request;
        const result: Promise<{ success: boolean; token: string }> = this.deviceControlService.applyConfig({
            deviceIp: body.ip,
            deviceMode: body.mode || LockMode.Guard,
            generateToken: true
        });
        body.token = (await result).token;
        return jsend.success({ i_device: (await Device.create(body)).i_device });
    }

    @POST({
        url: '/get_device_info',
        options: { schema: DeviceSchema.getDeviceInfoSchema }
    })
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
            device_info.status = await this.deviceControlService.pingDevice(device_info.ip, device_info.token);
        }
        return jsend.success({ device_info });
    }

    @POST({
        url: '/get_device_list',
        options: { schema: DeviceSchema.getDeviceListSchema }
    })
    async getDeviceList(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { with_device_status }: any = request.body;
        const device_list: Device[] = await Device.findAll();
        if (with_device_status && device_list.length) {
            for (const device of device_list) {
                device.status = await this.deviceControlService.pingDevice(device.ip, device.token);
            }
        }
        return jsend.success({ device_list });
    }

    @POST({
        url: '/update_device',
        options: { schema: DeviceSchema.updateDeviceSchema }
    })
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
        const resp: { success: boolean; token: string } = await this.deviceControlService.applyConfig({
            deviceIp: device_info.ip,
            deviceMode: device_info.mode,
            token: device_info.token,
            generateToken: true
        });
        if (resp.success) {
            device_info.token = resp.token;
        }
        device_info.save();
        return jsend.success(null);
    }

    @POST({
        url: '/delete_device',
        options: { schema: DeviceSchema.deleteDeviceSchema }
    })
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
