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
const role_model_1 = require("./role.model");
// @DefaultScope(() => ({
//     attributes: ['i_card', 'uuid', 'name', 'i_role']
// }))
// @Scopes(() => ({
//     extended_access_map: { include: [Role.scope('with_devices')] }
// }))
let Card = class Card extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], Card.prototype, "i_card", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Card.prototype, "uuid", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Card.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => role_model_1.Role), sequelize_typescript_1.Column({ onDelete: 'SET NULL' }),
    __metadata("design:type", Number)
], Card.prototype, "i_role", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => role_model_1.Role),
    __metadata("design:type", role_model_1.Role)
], Card.prototype, "role", void 0);
Card = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'cards',
        modelName: 'cards'
    })
], Card);
exports.Card = Card;
//# sourceMappingURL=card.model.js.map