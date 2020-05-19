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
const models_1 = require("../models");
const schemas_1 = require("../schemas");
const access_logger_service_1 = require("../services/access-logger.service");
let AccessControlController = class AccessControlController {
    checkCard(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ip, body } = request;
            const { uuid } = body;
            const devices = yield models_1.Device.findAll({ where: { ip } });
            const device = devices[0];
            const cards = yield models_1.Card.scope('extended_access_map').findAll({ where: { uuid } });
            const card = cards[0];
            let error = null;
            if (devices.length !== 1) {
                error = 'Device IP is not recognized';
            }
            else if (cards.length !== 1) {
                error = 'UUID is not registered';
            }
            else if (!card.i_role) {
                error = 'Role for card not specified';
            }
            else if (card.role.allowed_devices.every(({ i_device }) => i_device !== device.i_device)) {
                error = 'Device not in scope of allowed for your role';
            }
            this.accessLogSrv.logAction({ card, device, ip, error, uuid }).then();
            if (error) {
                throw Error('Access denied, reason: ' + error);
            }
            return jsend.success(null);
        });
    }
};
__decorate([
    fastify_decorators_1.Inject(access_logger_service_1.AccessLoggerService),
    __metadata("design:type", access_logger_service_1.AccessLoggerService)
], AccessControlController.prototype, "accessLogSrv", void 0);
__decorate([
    fastify_decorators_1.POST({ url: '/check_card', options: { schema: schemas_1.checkCard } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessControlController.prototype, "checkCard", null);
AccessControlController = __decorate([
    fastify_decorators_1.Controller({ route: '/access_control' })
], AccessControlController);
exports.AccessControlController = AccessControlController;
//# sourceMappingURL=access-control.controller.js.map