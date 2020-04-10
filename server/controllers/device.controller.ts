import { Device } from '@models';
import {
    addDeviceSchema,
    deleteDeviceSchema,
    getDeviceInfoSchema,
    getDeviceListSchema,
    updateDeviceSchema
} from '@schemas';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Controller, FastifyInstanceToken, Inject, POST } from 'fastify-decorators';
import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';

@Controller({ route: '/device' })
export default class DeviceController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @POST({ url: '/add_device', options: { schema: addDeviceSchema } })
    async addDevice(request: FastifyRequest): Promise<jsend.JSendObject> {
        return jsend.success({ i_device: (await Device.create(request.body)).i_device });
    }

    @POST({ url: '/get_device_info', options: { schema: getDeviceInfoSchema } })
    async getDeviceInfo(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const { i_device } = request.body;
        const device_info: Device = await Device.findByPk(i_device);
        if (!device_info) {
            reply.code(404).send(jsend.error(`Device with i_device: ${ i_device } not found`));
            return reply;
        }
        return jsend.success({ device_info });
    }

    @POST({ url: '/get_device_list', options: { schema: getDeviceListSchema } })
    async getDeviceList(): Promise<jsend.JSendObject> {
        return jsend.success({ device_list: await Device.findAll() });
    }

    @POST({ url: '/update_device', options: { schema: updateDeviceSchema } })
    async updateDevice(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const body: any = request.body;
        const device_info: Device = await Device.findByPk(body.i_device);
        if (!device_info) {
            reply.code(404).send(jsend.error(`Device with i_device: ${ body.i_device } not found`));
            return reply;
        }
        Object.keys(_.pick(body, ['name', 'description', 'ip'])).forEach((key) => (device_info[key] = body[key]));
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
            id: { [Op.in]: devices || i_device }
        });
        return jsend.success(null);
    }
}
