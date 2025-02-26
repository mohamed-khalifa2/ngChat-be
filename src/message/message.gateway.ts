import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesService } from './message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messagesService: MessagesService) { }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    messageData: { content: string; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.create(
      messageData.content,
      messageData.sender,
    );
    client.broadcast.emit('newMessage', message);
    return message;
  }


  @SubscribeMessage('fetchMessages')
  async fetchMessages(
    @MessageBody() sender: string, // Corrected MessageBody usage
    @ConnectedSocket() client: Socket
  ) {
    console.log("sender", sender)
    try {
      const messages = await this.messagesService.getMessagesBySender(sender);
      client.emit('messagesList', messages);
    } catch (error) {
      client.emit('messagesList', { error: 'Failed to fetch messages' });
    }
  }

}
