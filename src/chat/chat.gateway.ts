import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  handleConnection(client: Socket) {
    console.log('Client connected');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: string): string {
    console.log('Received message:', data);
    this.server.emit('message', data); // Broadcast the message to all clients
    return data;
  }
}
