import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GroupsModule } from './groups/groups.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule, UserModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
