import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { hash as hashText } from 'bcrypt';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import { QueryInterface } from 'sequelize';
import { Constants } from 'src/shared/constants';
import { v4 as uuid } from 'uuid';

import { Session, User } from '../models';

@Controller({ route: '/session' })
export class SessionController {
    private static async checkSID(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<Session> {
        const cookie: string = request.headers['Cookie'];
        if (!cookie) {
            reply.code(403).send(jsend.error('Session is not present'));
            return;
        }
        const SID: string = parseCookie(cookie)['SID'];
        if (!SID) {
            reply.code(403).send(jsend.error('Session is not present'));
            return;
        }
        const session: Session = await Session.findOne({ where: { session: SID } });
        if (!session) {
            reply.code(403).send(jsend.error('Session id is invalid'));
            // TODO: add life check, restrict if bigger then 1 week
            return;
        }
        if (~~(Date.now() / 1000) - ~~(session.createdAt.valueOf() / 1000) > Constants.timestampOneWeek) {
            reply.code(403).send(jsend.error('Session is expired'));
            return;
        }
        return session;
    }

    @POST({ url: '/login' })
    async login(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const { login, password } = request.body;
        const user: User = await User.findOne({ where: { login: hashText(login), password: hashText(password) } });
        // gen new seession
        const session: string = uuid();
        new Session({ session, i_user: user.i_user }).save();
        this.setSID(reply, session).send(jsend.success({ session }));
    }

    @POST({ url: '/logout' })
    async logout(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        jsend.success({});
    }

    @POST({ url: '/change_password' })
    async change_password(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const { login, old_password, new_password } = request.body;

        const user: User = await User.findOne({ where: { login: hashText(login), password: hashText(old_password) } });

        if (user) {
            user.password = hashText(new_password);
            await user.save();
            const queryInterface: QueryInterface = Session.sequelize.getQueryInterface();
            await queryInterface.bulkDelete(Session.tableName, { i_user: user.i_user });
            reply.send(jsend.success(null));
            return;
        }
        reply.code(403).send(jsend.error('Access denied'));
    }

    @POST({ url: '/get_my_data' })
    async getMyData(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const session: Session = await SessionController.checkSID(request, reply);
        if (!session) {
            return;
        }
        jsend.success({ name: session.user.name });
    }

    private setSID(reply: FastifyReply<ServerResponse>, session: string): FastifyReply<ServerResponse> {
        reply.header('Set-Cookie', serializeCookie('SID', session, { maxAge: 60 * 60 * 24 * 7 }));
        return reply;
    }
}
