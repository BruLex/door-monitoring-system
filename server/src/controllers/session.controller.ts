import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { compareSync as compareHash, hashSync as hashText } from 'bcrypt';
import { serialize as serializeCookie } from 'cookie';
import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import { QueryInterface } from 'sequelize';
import * as uuid from 'uuid-random';

import { Session, User } from '../models';
import { SessionSchema } from '../schemas';
import { SessionService } from '../services/session-service';

const LOGIN_ERROR: string = 'Login or password is incorrect';
const CHANGE_PASSWORD_ERROR: string = 'login field or session header should be present in request';

@Controller({ route: '/session' })
export class SessionController {
    @POST({ url: '/ping' })
    async ping(): Promise<jsend.JSendObject> {
        return jsend.success(null);
    }

    @POST({ url: '/login', options: { schema: SessionSchema.loginSchema, preHandler: null } })
    async login(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const { login, password } = request.body;
        const user: User = (await User.findAll()).find(
            (u) => compareHash(login, u.login) && compareHash(password, u.password)
        );
        if (!user) {
            console.error(LOGIN_ERROR);
            throw Error(LOGIN_ERROR);
        }
        const session: string = this.createNewSID(user.i_user);
        this.setSID(reply, session).send(jsend.success({ session }));
    }

    @POST({ url: '/logout', options: {} })
    async logout(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const session: Session = await SessionService.getCurrentSession(request);
        this.removeSID(reply, session.session).send(jsend.success({}));
        session.destroy();
    }

    @POST({ url: '/change_password', options: { preHandler: null } })
    async change_password(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const { login, old_password, new_password } = request.body;
        const session: Session = await SessionService.getCurrentSession(request);
        let user: User = null;
        if (!session && !login) {
            console.error(CHANGE_PASSWORD_ERROR);
            throw Error(CHANGE_PASSWORD_ERROR);
        }
        user = session
            ? session.user
            : (await User.findAll()).find((u) => compareHash(login, u.login) && compareHash(old_password, u.password));

        if (!user || !compareHash(old_password, user.password)) {
            console.error(LOGIN_ERROR);
            throw Error(LOGIN_ERROR);
        }
        user.password = hashText(new_password, 10);
        await user.save();
        const queryInterface: QueryInterface = Session.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(Session.tableName, { i_user: user.i_user });
        const sessionId: string = this.createNewSID(user.i_user);

        this.setSID(reply, sessionId).send(jsend.success(null));
    }

    @POST({ url: '/get_my_data' })
    async getMyData(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<void> {
        const session: Session = await SessionService.getCurrentSession(request);
        console.log(session.user);
        reply.send(jsend.success({ name: session.user.name }));
    }

    private setSID(reply: FastifyReply<ServerResponse>, session: string): FastifyReply<ServerResponse> {
        reply.header('Set-Cookie', serializeCookie('SID', session, { maxAge: 60 * 60 * 24 * 7 * 2, path: '/' }));
        return reply;
    }

    private removeSID(reply: FastifyReply<ServerResponse>, session: string): FastifyReply<ServerResponse> {
        reply.header('Set-Cookie', serializeCookie('SID', session, { expires: new Date(1970), path: '/' }));
        return reply;
    }

    private createNewSID(i_user: number): string {
        // gen new seession
        const session: string = uuid();
        new Session({ session, i_user }).save();
        return session;
    }
}
