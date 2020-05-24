import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { ServerResponse } from 'http';
import * as jsend from 'jsend';
import * as _ from 'lodash';
import { Op, QueryInterface } from 'sequelize';

import { Card } from '../models';
import { CardSchema } from '../schemas';

@Controller({ route: '/card/' })
export class CardController {
    @POST({
        url: '/add_card',
        options: { schema: CardSchema.addCardSchema }
    })
    async addCard(request: FastifyRequest): Promise<jsend.JSendObject> {
        return jsend.success({ i_card: (await Card.create(request.body)).i_card });
    }

    @POST({
        url: '/get_card_info',
        options: { schema: CardSchema.getCardInfoSchema }
    })
    async getCardInfo(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const { i_card }: any = request.body;
        const card_info: Card = await Card.findByPk(i_card);
        if (!card_info) {
            reply.code(404).send(jsend.error(`Card with i_card: ${i_card} not found`));
            return reply;
        }
        return jsend.success({ card_info });
    }

    @POST({
        url: '/get_card_list',
        options: { schema: CardSchema.getCardListSchema }
    })
    async getCardList(): Promise<jsend.JSendObject> {
        return jsend.success({ card_list: await Card.findAll() });
    }

    @POST({
        url: '/update_card',
        options: { schema: CardSchema.updateCardSchema }
    })
    async updateCard(
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
    ): Promise<jsend.JSendObject | FastifyReply<ServerResponse>> {
        const body: any = request.body;
        const card_info: Card = await Card.findByPk(body.i_card);
        if (!card_info) {
            reply.code(404).send(jsend.error(`Card with i_card: ${body.i_card} not found`));
            return reply;
        }
        Object.keys(_.pick(body, ['uuid', 'name', 'i_role'])).forEach(
            (key: string): any => (card_info[key] = body[key])
        );
        card_info.save();
        return jsend.success(null);
    }

    @POST({
        url: '/delete_card',
        options: { schema: CardSchema.deleteCardSchema }
    })
    async deleteCard(request: FastifyRequest): Promise<jsend.JSendObject> {
        const { cards, i_card }: any = request.body;
        if (cards && i_card) {
            throw new Error('Should be specified only one property(i_card or cards) for deletion');
        }
        if (!cards && !i_card) {
            throw new Error('Should be specified at least one property(i_card or cards) for deletion');
        }
        const queryInterface: QueryInterface = Card.sequelize.getQueryInterface();
        await queryInterface.bulkDelete(Card.tableName, {
            i_card: { [Op.in]: cards || [i_card] }
        });
        return jsend.success(null);
    }
}
