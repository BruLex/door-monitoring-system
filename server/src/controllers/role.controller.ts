import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';

import { Role, RoleDevicePermission } from '../models';
import { RoleSchema } from '../schemas';
import { SessionService } from '../services/session-service';

@Controller({ route: '/role' })
export class RoleController {
    @POST({
        url: '/add_role',
        options: { schema: RoleSchema.addRoleSchema }
    })
    async addRole(request: FastifyRequest): Promise<jsend.JSendObject> {
        const role: Role = await Role.create(_.pick(request.body, ['name', 'allowed_all']));
        const { i_role } = role;
        if (!request.body.allowed_all && !!request.body.allowed_devices) {
            for (const device of request.body.allowed_devices) {
                const i_device: number = Number(device.i_device);
                await RoleDevicePermission.create({ i_role, i_device });
            }
        }
        return jsend.success({ i_role });
    }

    @POST({
        url: '/get_role_info',
        options: { schema: RoleSchema.getRoleInfoSchema }
    })
    async getRoleInfo(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const { i_role }: any = request.body;
        const role_info: Role = await Role.scope(request.body.extended_info ? 'extended' : 'defaultScope').findByPk(
            i_role
        );
        if (!role_info) {
            reply.code(404).send(jsend.error(`Role with i_role: ${i_role} not found`));
            return reply;
        }
        return jsend.success({ role_info });
    }

    @POST({
        url: '/get_role_list',
        options: { schema: RoleSchema.getRoleListSchema }
    })
    async getRoleList(request: FastifyRequest): Promise<jsend.JSendObject> {
        return jsend.success({
            role_list: await Role.scope(request.body.extended_info ? 'extended' : 'defaultScope').findAll()
        });
    }

    @POST({
        url: '/update_role',
        options: { schema: RoleSchema.updateRoleSchema }
    })
    async updateRole(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const body: any = request.body;
        const { allowed_devices, i_role }: any = request.body;
        const role_info: Role = await Role.findByPk(i_role);
        if (!role_info) {
            reply.code(404).send(jsend.error(`Role with i_role: ${i_role} not found`));
            return reply;
        }
        Object.keys(_.pick(body, ['name', 'allowed_all'])).forEach((key: string): any => (role_info[key] = body[key]));
        role_info.save();
        const queryInterface: QueryInterface = RoleDevicePermission.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(RoleDevicePermission.tableName, { i_role });

        if (!role_info.allowed_all && !!allowed_devices) {
            await RoleDevicePermission.bulkCreate(allowed_devices.map(({ i_device }) => ({ i_device, i_role })));
        }
        return jsend.success(null);
    }

    @POST({
        url: '/delete_role',
        options: { schema: RoleSchema.deleteRoleSchema }
    })
    async deleteRole(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { roles, i_role }: any = request.body;
        if (roles && i_role) {
            throw new Error('Should be specified only one property(i_role or roles) for deletion');
        }
        if (!roles && !i_role) {
            throw new Error('Should be specified at least one property(i_role or roles) for deletion');
        }
        const queryInterface: QueryInterface = Role.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(Role.tableName, {
            i_role: { [Op.in]: roles || [i_role] }
        });
        return jsend.success(null);
    }
}
