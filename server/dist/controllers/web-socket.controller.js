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
let WebSocketController = class WebSocketController {
    constructor() {
        this.clients = [];
    }
    handler(connection, request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('new client');
            this.clients.push(connection.socket);
            console.log('now clients is:', this.clients.length);
            connection.socket.on('message', (message) => {
                // connection.socket.send('hi from server, you send next:' + message);
                this.clients.filter((c) => c !== connection.socket).forEach((client) => client.send(message));
            });
        });
    }
};
__decorate([
    fastify_decorators_1.Inject(fastify_decorators_1.FastifyInstanceToken),
    __metadata("design:type", Object)
], WebSocketController.prototype, "instance", void 0);
__decorate([
    fastify_decorators_1.GET({ url: '/', options: { websocket: true } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketController.prototype, "handler", null);
WebSocketController = __decorate([
    fastify_decorators_1.Controller({ route: '/ws' })
], WebSocketController);
exports.WebSocketController = WebSocketController;
//# sourceMappingURL=web-socket.controller.js.map