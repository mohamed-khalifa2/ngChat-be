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

  async findMessages(sender: string, receiver: string) {
    return this.messageModel
      .find({
        $and: [{ sender: sender }, { receiver: receiver }],
      })
      .populate('sender receiver')
      .exec();
  }
}
