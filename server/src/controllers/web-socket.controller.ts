import { FastifyInstance, FastifyRequest } from 'fastify';
import { Controller, FastifyInstanceToken, GET, Inject } from 'fastify-decorators';
import { SocketStream } from 'fastify-websocket';

import * as WebSocket from 'ws';

@Controller({ route: '/ws' })
export class WebSocketController {
    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    private clients: WebSocket[] = [];

    @GET({ url: '/', options: { websocket: true } })
    async handler(connection: SocketStream, request: FastifyRequest, params?: { [key: string]: any }): Promise<any> {
        console.log('new client');
        this.clients.push(connection.socket);
        console.log('now clients is:', this.clients.length);
        connection.socket.on('message', (message) => {
            // connection.socket.send('hi from server, you send next:' + message);

            this.clients.filter((c) => c !== connection.socket).forEach((client) => client.send(message));
        });
    }
}
