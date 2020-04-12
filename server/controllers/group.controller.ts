import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Controller, FastifyInstanceToken, Inject, POST } from 'fastify-decorators';

import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';

import { Group, GroupDevicePermissions } from '@models';
import { addGroupSchema, deleteGroupSchema, getGroupInfoSchema, getGroupListSchema, updateGroupSchema } from '@schemas';

@Controller({ route: '/group' })
export default class GroupController {
    @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

    @POST({ url: '/add_group', options: { schema: addGroupSchema } })
    async addGroup(request: FastifyRequest): Promise<jsend.JSendObject> {
        const group: Group = await Group.create(_.pick(request.body, ['name', 'allowed_all']));
        const i_group: number = group.i_group;
        if (!request.body.allowed_all && !!request.body.allowed_devices) {
            for (const device of request.body.allowed_devices) {
                const i_device: number = Number(device.i_device);
                await GroupDevicePermissions.create({ i_group, i_device });
            }
        }
        return jsend.success({ i_group });
    }

    @POST({ url: '/get_group_info', options: { schema: getGroupInfoSchema } })
    async getGroupInfo(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const { i_group }: any = request.body;
        const group_info: Group = await Group.scope(request.body.extended_info ? 'extended' : 'defaultScope').findByPk(
            i_group
        );
        if (!group_info) {
            reply.code(404).send(jsend.error(`Group with i_group: ${i_group} not found`));
            return reply;
        }
        return jsend.success({ group_info });
    }

    @POST({ url: '/get_group_list', options: { schema: getGroupListSchema } })
    async getGroupList(request: FastifyRequest): Promise<jsend.JSendObject> {
        return jsend.success({
            group_list: await Group.scope(request.body.extended_info ? 'extended' : 'defaultScope').findAll()
        });
    }

    @POST({ url: '/update_group', options: { schema: updateGroupSchema } })
    async updateGroup(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const body: any = request.body;
        const { allowed_devices, i_group }: any = request.body;
        const group_info: Group = await Group.findByPk(i_group);
        if (!group_info) {
            reply.code(404).send(jsend.error(`Group with i_group: ${i_group} not found`));
            return reply;
        }
        Object.keys(_.pick(body, ['name', 'allowed_all'])).forEach((key: string): any => (group_info[key] = body[key]));
        group_info.save();
        const queryInterface: QueryInterface = GroupDevicePermissions.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(GroupDevicePermissions.tableName, { i_group });

        if (!group_info.allowed_all && !!allowed_devices) {
            GroupDevicePermissions.bulkCreate(
                allowed_devices.map(({ i_device }): { i_group: any; i_device: any } => ({ i_device, i_group }))
            );
        }
        return jsend.success(null);
    }

    @POST({ url: '/delete_group', options: { schema: deleteGroupSchema } })
    async deleteGroup(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { groups, i_group }: any = request.body;
        if (groups && i_group) {
            throw new Error('Should be specified only one property(i_group or groups) for deletion');
        }
        if (!groups && !i_group) {
            throw new Error('Should be specified at least one property(i_group or groups) for deletion');
        }
        const queryInterface: QueryInterface = Group.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(Group.tableName, {
            i_group: { [Op.in]: groups || [i_group] }
        });
        return jsend.success(null);
    }
}
