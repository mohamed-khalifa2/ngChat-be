import { Module } from '@nestjs/common';
import { MessagesGateway } from './message.gateway';
import { MessagesService } from './message.service';
import { Message, MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
})
export class MessageModule {}
