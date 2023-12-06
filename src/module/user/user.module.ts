import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TaskService } from 'src/module/task/task.service';

@Module({
  imports: [],
  providers: [UserResolver, UserService, TaskService],
  exports: [UserService],
})
export class UserModule {}
