import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(name: string, createdBy: string, members: string[]) {
    const group = new this.groupModel({ name, createdBy, members });
    return group.save();
  }

  async findByUser(userId: string) {
    return this.groupModel.find({ members: userId }).populate('members').exec();
  }
}
