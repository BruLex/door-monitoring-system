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
const fs = require("fs");
const fs_1 = require("fs");
const jsend = require("jsend");
const schemas_1 = require("../schemas");
let ConfigController = class ConfigController {
    getConfigs() {
        return __awaiter(this, void 0, void 0, function* () {
            return jsend.success(JSON.parse(fs.readFileSync('../configs/config.json', { encoding: 'UTF-8' })));
        });
    }
    updateConfigs(request) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.promises
                .writeFile('../server/configs/config.json', JSON.stringify(request.body, null, 2))
                .then(() => jsend.success(true))
                .catch(jsend.error);
        });
    }
};
__decorate([
    fastify_decorators_1.POST({ url: '/get_configs', options: { schema: schemas_1.getConfigsSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getConfigs", null);
__decorate([
    fastify_decorators_1.POST({ url: '/update_configs', options: { schema: schemas_1.updateConfigsSchema } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "updateConfigs", null);
ConfigController = __decorate([
    fastify_decorators_1.Controller({ route: '/config' })
], ConfigController);
exports.ConfigController = ConfigController;
//# sourceMappingURL=config.controller.js.map