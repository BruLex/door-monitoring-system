"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_decorators_1 = require("fastify-decorators");
const jsend = require("jsend");
const _ = require("lodash");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const schemas_1 = require("../schemas");
let CardController = class CardController {
    addCard(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsend.success({ i_card: (yield models_1.Card.create(request.body)).i_card });
        });
    }
    getCardInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { i_card } = request.body;
            const card_info = yield models_1.Card.findByPk(i_card);
            if (!card_info) {
                reply.code(404).send(jsend.error(`Card with i_card: ${i_card} not found`));
                return reply;
            }
            return jsend.success({ card_info });
        });
    }
    getCardList() {
        return __awaiter(this, void 0, void 0, function* () {
            return jsend.success({ card_list: yield models_1.Card.findAll() });
        });
    }
    updateCard(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const card_info = yield models_1.Card.findByPk(body.i_card);
            if (!card_info) {
                reply.code(404).send(jsend.error(`Card with i_card: ${body.i_card} not found`));
                return reply;
            }
            Object.keys(_.pick(body, ['uuid', 'name', 'i_role'])).forEach((key) => (card_info[key] = body[key]));
            card_info.save();
            return jsend.success(null);
        });
    }
    deleteCard(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cards, i_card } = request.body;
            if (cards && i_card) {
                throw new Error('Should be specified only one property(i_card or cards) for deletion');
            }
            if (!cards && !i_card) {
                throw new Error('Should be specified at least one property(i_card or cards) for deletion');
            }
            const queryInterface = models_1.Card.sequelize.getQueryInterface();
            yield queryInterface.bulkDelete(models_1.Card.tableName, {
                i_card: { [sequelize_1.Op.in]: cards || [i_card] }
            });
            return jsend.success(null);
        });
    }
};
__decorate([
    fastify_decorators_1.POST({ url: '/add_card', options: { schema: schemas_1.addCardSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "addCard", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_card_info', options: { schema: schemas_1.getCardInfoSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "getCardInfo", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_card_list', options: { schema: schemas_1.getCardListSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CardController.prototype, "getCardList", null);
__decorate([
    fastify_decorators_1.POST({ url: '/update_card', options: { schema: schemas_1.updateCardSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "updateCard", null);
__decorate([
    fastify_decorators_1.POST({ url: '/delete_card', options: { schema: schemas_1.deleteCardSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "deleteCard", null);
CardController = __decorate([
    fastify_decorators_1.Controller({ route: '/card/' })
], CardController);
exports.CardController = CardController;
//# sourceMappingURL=card.controller.js.map