import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';

import { User } from '../models';
import { addUserSchema, deleteUserSchema, getUserInfoSchema, getUserListSchema, updateUserSchema } from '../schemas';

@Controller({ route: '/user/' })
export default class UserController {
    @POST({ url: '/add_user', options: { schema: addUserSchema } })
    async addUser(request: FastifyRequest): Promise<jsend.JSendObject> {
        return jsend.success({ i_user: (await User.create(request.body)).i_user });
    }

    @POST({ url: '/get_user_info', options: { schema: getUserInfoSchema } })
    async getUserInfo(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const { i_user }: any = request.body;
        const user_info: User = await User.findByPk(i_user);
        if (!user_info) {
            reply.code(404).send(jsend.error(`User with i_user: ${i_user} not found`));
            return reply;
        }
        return jsend.success({ user_info });
    }

    @POST({ url: '/get_user_list', options: { schema: getUserListSchema } })
    async getUserList(): Promise<jsend.JSendObject> {
        return jsend.success({ user_list: await User.findAll() });
    }

    @POST({ url: '/update_user', options: { schema: updateUserSchema } })
    async updateUser(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const body: any = request.body;
        const user_info: User = await User.findByPk(body.i_user);
        if (!user_info) {
            reply.code(404).send(jsend.error(`User with i_user: ${body.i_user} not found`));
            return reply;
        }
        Object.keys(_.pick(body, ['uuid', 'name', 'i_role'])).forEach(
            (key: string): any => (user_info[key] = body[key])
        );
        user_info.save();
        return jsend.success(null);
    }

    @POST({ url: '/delete_user', options: { schema: deleteUserSchema } })
    async deleteUser(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { users, i_user }: any = request.body;
        if (users && i_user) {
            throw new Error('Should be specified only one property(i_user or users) for deletion');
        }
        if (!users && !i_user) {
            throw new Error('Should be specified at least one property(i_user or users) for deletion');
        }
        const queryInterface: QueryInterface = User.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(User.tableName, {
            i_user: { [Op.in]: users || [i_user] }
        });
        return jsend.success(null);
    }
}
