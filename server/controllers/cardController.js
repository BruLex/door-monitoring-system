const jsend = require('jsend');
const cardSchemas = require('../schemas/cardShemas');

module.exports = async (fastify, options) => {
    const Card = fastify.sequelize.define(...fastify.cardModel);

    fastify.post('/api/card/add_card', {schema: cardSchemas.addCardSchema}, async (req, reply) => {
        return Card.create(req.body)
            .then(obj =>  jsend.success({i_card: obj.i_card}))
            .catch(err => jsend.error(err.errmsg));
    });
    fastify.post('/api/card/get_card_info', {schema: cardSchemas.getCardInfoSchema}, async (req, reply) => {
        return await Card.findByPk(req.body.i_card).then(obj => jsend.success({card_info: obj}));
    });
    fastify.post('/api/card/get_card_list', {schema: cardSchemas.getCardListSchema}, async (req, reply) => {
        return await Card.findAll().then(obj => jsend.success({card_list: obj}));
    });
    fastify.post('/api/card/update_card_info', {schema: cardSchemas.updateCardInfoSchema}, async (req, reply) => {
        await Card.update( {uid: req.body.uid}, {where: {i_card: req.body.i_card}});
        return jsend.success(null);
    });
    fastify.post('/api/card/delete_card', {schema: cardSchemas.deleteCardSchema}, async (req, reply) => {
        await (await Card.findByPk(req.body.i_card)).destroy();
        return jsend.success(null);
    });
};

