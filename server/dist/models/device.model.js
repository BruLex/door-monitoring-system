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
const types_1 = require("../shared/types");
let Device = class Device extends sequelize_typescript_1.Model {
    toJSON() {
        return Object.assign({}, super.toJSON(), { status: this.status });
    }
};
__decorate([
    sequelize_typescript_1.Column({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], Device.prototype, "i_device", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false }),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: true }),
    __metadata("design:type", String)
], Device.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column({ unique: true }),
    __metadata("design:type", String)
], Device.prototype, "ip", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.ENUM(types_1.LockMode.Locked, types_1.LockMode.Unlocked, types_1.LockMode.Guard),
        defaultValue: types_1.LockMode.Guard
    }),
    __metadata("design:type", String)
], Device.prototype, "mode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Device.prototype, "token", void 0);
Device = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'devices',
        modelName: 'devices'
    })
], Device);
exports.Device = Device;
//# sourceMappingURL=device.model.js.map