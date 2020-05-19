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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const device_model_1 = require("./device.model");
const role_model_1 = require("./role.model");
const card_model_1 = require("./card.model");
let Log = class Log extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], Log.prototype, "i_log", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => device_model_1.Device), sequelize_typescript_1.Column({ onDelete: 'SET NULL' }),
    __metadata("design:type", Number)
], Log.prototype, "i_device", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Log.prototype, "device_name", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => device_model_1.Device),
    __metadata("design:type", device_model_1.Device)
], Log.prototype, "device", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => role_model_1.Role), sequelize_typescript_1.Column({ onDelete: 'SET NULL' }),
    __metadata("design:type", Number)
], Log.prototype, "i_role", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Log.prototype, "role_name", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => role_model_1.Role),
    __metadata("design:type", role_model_1.Role)
], Log.prototype, "role", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => card_model_1.Card), sequelize_typescript_1.Column({ onDelete: 'SET NULL' }),
    __metadata("design:type", Number)
], Log.prototype, "i_card", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Log.prototype, "card_name", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => card_model_1.Card),
    __metadata("design:type", card_model_1.Card)
], Log.prototype, "card", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], Log.prototype, "time", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Log.prototype, "access", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Log.prototype, "device_ip", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Log.prototype, "uuid", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Log.prototype, "error", void 0);
Log = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'logs',
        modelName: 'logs'
    })
], Log);
exports.Log = Log;
//# sourceMappingURL=log.model.js.map