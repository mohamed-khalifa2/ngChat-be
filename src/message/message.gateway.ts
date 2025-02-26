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
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from headers or cookies
      const token = this.extractTokenFromHandshake(client);
      if (!token) throw new UnauthorizedException('No token provided');
      // Verify token
      const decoded = await this.jwtService.verifyAsync(token);
      // Find user
      const user = await this.userService.findById(decoded.id);
      if (!user) throw new UnauthorizedException('User not found');
      // Attach user to client
      client.data.user = user;
      console.log(`Client connected: ${client.id}, User: ${user.email}`);
    } catch (error) {
      console.error(`Connection failed: ${error.message}`);
      client.disconnect();
    }
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

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // Check for token in Authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // Check for token in cookies
    return (
      client.handshake.auth?.jwt ||
      client.handshake.headers.cookie?.split('jwt=')[1]?.split(';')[0]
    );
  }
}
