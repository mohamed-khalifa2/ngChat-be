import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(content: string, sender: string, receiver?: string) {
    const message = new this.messageModel({
      content,
      sender,
      receiver: receiver || null,
    });
    return message.save();
  }

  async getMessagesBetweenUsers(user1: string, user2: string) {
    return this.messageModel
      .find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      })
      .populate('sender receiver')
      .exec();
  }
}
