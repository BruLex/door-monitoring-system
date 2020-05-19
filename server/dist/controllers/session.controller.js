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
const bcrypt_1 = require("bcrypt");
const cookie_1 = require("cookie");
const jsend = require("jsend");
const constants_1 = require("src/shared/constants");
const uuid_1 = require("uuid");
const models_1 = require("../models");
let SessionController = SessionController_1 = class SessionController {
    static checkSID(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookie = request.headers['Cookie'];
            if (!cookie) {
                reply.code(403).send(jsend.error('Session is not present'));
                return;
            }
            const SID = cookie_1.parse(cookie)['SID'];
            if (!SID) {
                reply.code(403).send(jsend.error('Session is not present'));
                return;
            }
            const session = yield models_1.Session.findOne({ where: { session: SID } });
            if (!session) {
                reply.code(403).send(jsend.error('Session id is invalid'));
                // TODO: add life check, restrict if bigger then 1 week
                return;
            }
            if (~~(Date.now() / 1000) - ~~(session.createdAt.valueOf() / 1000) > constants_1.Constants.timestampOneWeek) {
                reply.code(403).send(jsend.error('Session is expired'));
                return;
            }
            return session;
        });
    }
    login(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password } = request.body;
            const user = yield models_1.User.findOne({ where: { login: bcrypt_1.hash(login), password: bcrypt_1.hash(password) } });
            // gen new seession
            const session = uuid_1.v4();
            new models_1.Session({ session, i_user: user.i_user }).save();
            this.setSID(reply, session).send(jsend.success({ session }));
        });
    }
    logout(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            jsend.success({});
        });
    }
    change_password(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, old_password, new_password } = request.body;
            const user = yield models_1.User.findOne({ where: { login: bcrypt_1.hash(login), password: bcrypt_1.hash(old_password) } });
            if (user) {
                user.password = bcrypt_1.hash(new_password);
                yield user.save();
                const queryInterface = models_1.Session.sequelize.getQueryInterface();
                yield queryInterface.bulkDelete(models_1.Session.tableName, { i_user: user.i_user });
                reply.send(jsend.success(null));
                return;
            }
            reply.code(403).send(jsend.error('Access denied'));
        });
    }
    getMyData(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield SessionController_1.checkSID(request, reply);
            if (!session) {
                return;
            }
            jsend.success({ name: session.user.name });
        });
    }
    setSID(reply, session) {
        reply.header('Set-Cookie', cookie_1.serialize('SID', session, { maxAge: 60 * 60 * 24 * 7 }));
        return reply;
    }
};
__decorate([
    fastify_decorators_1.POST({ url: '/login' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "login", null);
__decorate([
    fastify_decorators_1.POST({ url: '/logout' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "logout", null);
__decorate([
    fastify_decorators_1.POST({ url: '/change_password' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "change_password", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_my_data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getMyData", null);
SessionController = SessionController_1 = __decorate([
    fastify_decorators_1.Controller({ route: '/session' })
], SessionController);
exports.SessionController = SessionController;
var SessionController_1;
//# sourceMappingURL=session.controller.js.map