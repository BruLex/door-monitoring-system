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
const device_control_service_1 = require("src/services/device-control.service");
const constants_1 = require("src/shared/constants");
const models_1 = require("../models");
const schemas_1 = require("../schemas");
var constants_2 = require("../shared/constants");
exports.Constants = constants_2.Constants;
let DeviceController = class DeviceController {
    addDevice(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            // this.deviceCtrlSrv.applyConfig({
            //     deviceIp: body.ip,
            //     deviceMode: body.mode || LockMode.Guard,
            //     generateToken: true
            // });
            return jsend.success({ i_device: (yield models_1.Device.create(body)).i_device });
        });
    }
    getDeviceInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { i_device, with_device_status } = request.body;
            const device_info = yield models_1.Device.findByPk(i_device);
            if (!device_info) {
                reply.code(500).send(jsend.error(`Device with i_device: ${i_device} not found`));
                return reply;
            }
            if (with_device_status) {
                device_info.status = yield this.deviceCtrlSrv.pingDevice(device_info.ip);
            }
            return jsend.success({ device_info });
        });
    }
    getDeviceList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { with_device_status } = request.body;
            const device_list = yield models_1.Device.findAll();
            if (with_device_status && device_list.length) {
                for (const device of device_list) {
                    device.status = yield this.deviceCtrlSrv.pingDevice(device.ip);
                }
            }
            return jsend.success({ device_list });
        });
    }
    updateDevice(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const device_info = yield models_1.Device.findByPk(body.i_device);
            if (!device_info) {
                reply.code(404).send(jsend.error(`Device with i_device: ${body.i_device} not found`));
                return reply;
            }
            Object.keys(_.pick(body, ['name', 'description', 'ip', 'mode'])).forEach((key) => (device_info[key] = body[key]));
            if (body.mode) {
                console.log(device_info.token);
                console.log(device_info.token || constants_1.Constants.defaultToken);
                yield this.deviceCtrlSrv.applyConfig({
                    deviceIp: device_info.ip,
                    deviceMode: device_info.mode,
                    token: device_info.token || constants_1.Constants.defaultToken
                });
            }
            device_info.save();
            return jsend.success(null);
        });
    }
    deleteDevice(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { devices, i_device } = request.body;
            if (devices && i_device) {
                throw new Error('Should be specified only one property(i_device or devices) for deletion');
            }
            if (!devices && !i_device) {
                throw new Error('Should be specified at least one property(i_device or devices) for deletion');
            }
            const queryInterface = models_1.Device.sequelize.getQueryInterface();
            yield queryInterface.bulkDelete(models_1.Device.tableName, {
                i_device: { [sequelize_1.Op.in]: devices || [i_device] }
            });
            return jsend.success(null);
        });
    }
};
__decorate([
    fastify_decorators_1.Inject(device_control_service_1.DeviceControlService),
    __metadata("design:type", device_control_service_1.DeviceControlService)
], DeviceController.prototype, "deviceCtrlSrv", void 0);
__decorate([
    fastify_decorators_1.POST({ url: '/add_device', options: { schema: schemas_1.addDeviceSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "addDevice", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_device_info', options: { schema: schemas_1.getDeviceInfoSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "getDeviceInfo", null);
__decorate([
    fastify_decorators_1.POST({ url: '/get_device_list', options: { schema: schemas_1.getDeviceListSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "getDeviceList", null);
__decorate([
    fastify_decorators_1.POST({ url: '/update_device', options: { schema: schemas_1.updateDeviceSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "updateDevice", null);
__decorate([
    fastify_decorators_1.POST({ url: '/delete_device', options: { schema: schemas_1.deleteDeviceSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "deleteDevice", null);
DeviceController = __decorate([
    fastify_decorators_1.Controller({ route: '/device' })
], DeviceController);
exports.DeviceController = DeviceController;
//# sourceMappingURL=device.controller.js.map