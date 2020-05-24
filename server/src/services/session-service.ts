import { FastifyReply, FastifyRequest } from 'fastify';
import { Service } from 'fastify-decorators';

import { parse as parseCookie } from 'cookie';
import { ServerResponse } from 'http';
import * as jsend from 'jsend';

import { Session } from '../models';
import { Constants } from '../shared/constants';

@Service()
export class SessionService {
    static async getCurrentSession(request: FastifyRequest): Promise<Session> {
        const cookie: string = request.headers['cookie'];
        if (!cookie) {
            return;
        }
        const SID: string = parseCookie(cookie)['SID'];
        if (!SID) {
            return;
        }
        return Session.findOne({ where: { session: SID } });
    }

    static async checkSID(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<Session> {
        if (request.raw.url.match(/^(\/session\/(login|change_password)|\/access_control\/check_card|\/ui)/)) {
            return;
        }
        const session: Session = await SessionService.getCurrentSession(request);
        if (!session) {
            reply.code(403).send(jsend.error('Access denied: Session is invalid or not present'));
            return;
        }
        if (~~(Date.now() / 1000) - ~~(session.createdAt.valueOf() / 1000) > Constants.timestampOneWeek) {
            reply.code(403).send(jsend.error('Access denied: Session is expired'));
            return;
        }
        return session;
    }
}
