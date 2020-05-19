"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const axios_1 = require("axios");
const ip = require("ip");
const url_1 = require("url");
const uuid_1 = require("uuid");
const device_controller_1 = require("../controllers/device.controller");
const constants_1 = require("../shared/constants");
let DeviceControlService = class DeviceControlService {
    pingDevice(deviceIp) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = axios_1.default.create({
                baseURL: 'http://' + deviceIp,
                responseType: 'json',
                timeout: device_controller_1.Constants.defaultTimeout
            });
            try {
                const pingResult = yield client.post(constants_1.DeviceApiEndpoints.Ping);
                return pingResult ? .data ? .status === 'success' :  : ;
            }
            catch (e) {
                return false;
            }
        });
    }
    applyConfig(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deviceIp, deviceMode, generateToken = false, token } = options;
            if (!(yield this.pingDevice(deviceIp))) {
                throw Error('Cannot update config for not active device');
            }
            const config = {
                mode: deviceMode,
                server_address: ip.address() + ':' + 3000,
                token
            };
            if (generateToken) {
                config.token = uuid_1.v4();
            }
            const params = new url_1.URLSearchParams();
            Object.keys(config).forEach((field) => params.append(field, config[field]));
            const client = axios_1.default.create({
                baseURL: 'http://' + deviceIp,
                responseType: 'json',
                timeout: device_controller_1.Constants.defaultTimeout,
                headers: { TOKEN: config.token }
            });
            try {
                const pingResult = yield client.post(constants_1.DeviceApiEndpoints.UpdateConfig, params);
                if (pingResult ? .data ? .status !== 'success' :  : ) {
                    throw Error('error');
                }
            }
            catch (e) {
                console.log('error:' + e);
                throw Error('Cannot update config for device');
            }
            return config.token;
        });
    }
};
DeviceControlService = __decorate([
    fastify_decorators_1.Service()
], DeviceControlService);
exports.DeviceControlService = DeviceControlService;
//# sourceMappingURL=device-control.service.js.map