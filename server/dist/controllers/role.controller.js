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
let RoleController = class RoleController {
    addRole(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield models_1.Role.create(_.pick(request.body, ['name', 'allowed_all']));
            const { i_role } = role;
            if (!request.body.allowed_all && !!request.body.allowed_devices) {
                for (const device of request.body.allowed_devices) {
                    const i_device = Number(device.i_device);
                    yield models_1.RoleDevicePermission.create({ i_role, i_device });
                }
            }
            return jsend.success({ i_role });
        });
    }
    getRoleInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { i_role } = request.body;
            const role_info = yield models_1.Role.scope(request.body.extended_info ? 'extended' : 'defaultScope').findByPk(i_role);
            if (!role_info) {
                reply.code(404).send(jsend.error(`Role with i_role: ${i_role} not found`));
                return reply;
            }
            return jsend.success({ role_info });
        });
    }
    getRoleList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsend.success({
                role_list: yield models_1.Role.scope(request.body.extended_info ? 'extended' : 'defaultScope').findAll()
            });
        });
    }
    updateRole(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { allowed_devices, i_role } = request.body;
            const role_info = yield models_1.Role.findByPk(i_role);
            if (!role_info) {
                reply.code(404).send(jsend.error(`Role with i_role: ${i_role} not found`));
                return reply;
            }
            Object.keys(_.pick(body, ['name', 'allowed_all'])).forEach((key) => (role_info[key] = body[key]));
            role_info.save();
            const queryInterface = models_1.RoleDevicePermission.sequelize.getQueryInterface();
            yield queryInterface.bulkDelete(models_1.RoleDevicePermission.tableName, { i_role });
            if (!role_info.allowed_all && !!allowed_devices) {
                yield models_1.RoleDevicePermission.bulkCreate(allowed_devices.map(({ i_device }) => ({ i_device, i_role })));
            }
            return jsend.success(null);
        });
    }
    deleteRole(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roles, i_role } = request.body;
            if (roles && i_role) {
                throw new Error('Should be specified only one property(i_role or roles) for deletion');
            }
            if (!roles && !i_role) {
                throw new Error('Should be specified at least one property(i_role or roles) for deletion');
            }
            const queryInterface = models_1.Role.sequelize.getQueryInterface();
            yield queryInterface.bulkDelete(models_1.Role.tableName, {
                i_role: { [sequelize_1.Op.in]: roles || [i_role] }
            });
            return jsend.success(null);
        });
    }
};
__decorate([
    fastify_decorators_1.POST({ url: '/add_role', options: { schema: schemas_1.addRoleSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "addRole", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_role_info', options: { schema: schemas_1.getRoleInfoSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRoleInfo", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_role_list', options: { schema: schemas_1.getRoleListSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRoleList", null);
__decorate([
    fastify_decorators_1.POST({ url: '/update_role', options: { schema: schemas_1.updateRoleSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "updateRole", null);
__decorate([
    fastify_decorators_1.POST({ url: '/delete_role', options: { schema: schemas_1.deleteRoleSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "deleteRole", null);
RoleController = __decorate([
    fastify_decorators_1.Controller({ route: '/role' })
], RoleController);
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map