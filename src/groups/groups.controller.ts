import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  create(@Body() body: { name: string; createdBy: string; members: string[] }) {
    return this.groupsService.create(body.name, body.createdBy, body.members);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.groupsService.findByUser(userId);
  }
}
