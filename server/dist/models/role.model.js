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
const card_model_1 = require("./card.model");
const role_device_permission_model_1 = require("./role-device-permission.model");
let Role = class Role extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], Role.prototype, "i_role", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({ allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], Role.prototype, "allowed_all", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => card_model_1.Card, 'i_role'),
    __metadata("design:type", Array)
], Role.prototype, "cards", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => device_model_1.Device, () => role_device_permission_model_1.RoleDevicePermission),
    __metadata("design:type", Array)
], Role.prototype, "allowed_devices", void 0);
Role = __decorate([
    sequelize_typescript_1.DefaultScope(() => ({
        attributes: ['i_role', 'name', 'allowed_all']
    })),
    sequelize_typescript_1.Scopes(() => ({
        extended: { include: [card_model_1.Card, device_model_1.Device] },
        with_devices: { include: [device_model_1.Device] }
    })),
    sequelize_typescript_1.Table({
        tableName: 'roles',
        modelName: 'roles'
    })
], Role);
exports.Role = Role;
//# sourceMappingURL=role.model.js.map