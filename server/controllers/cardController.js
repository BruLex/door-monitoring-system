'use strict'

const Card = require('../models/cardModel');
const jsend = require('jsend');
const cardSchemas = require('../schemas/cardShemas');




module.exports = async (fastify, options) => {

    fastify.post('/api/card/add_card', {schema: cardSchemas.addCardSchema}, async (req, reply) => {
        return Card.create(req.body).then(objb => {
            return jsend.success({_id: objb._id});
        }).catch(err => {
            return jsend.error(err.errmsg);
        })
    });

    fastify.post('/api/card/get_card_info', {schema: cardSchemas.getCardInfoSchema}, async (req, reply) => {
        console.log(req.body);
        return Card.findById(req.body._id).exec().then(obj => {
            return jsend.success({card_info: obj});
        });
    });
    fastify.post('/api/card/get_card_list', {schema: cardSchemas.getCardListSchema}, async (req, reply) => {
        return await Card.find().then(obj => {
            return jsend.success({card_list: obj});
        });
    });
    fastify.post('/api/card/update_card_info', {schema: cardSchemas.updateCardInfoSchema}, async (req, reply) => {
        await Card.updateOne({_id: req.body._id}, {uid: req.body.uid});
        return {success: true}
    });
    fastify.post('/api/card/delete_card', {schema: cardSchemas.deleteCardSchema}, async (req, reply) => {
        await Card.deleteOne({_id: req.body._id});
        return {success: true}
    });
};

