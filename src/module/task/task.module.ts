import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { UserService } from 'src/module/user/user.service';

@Module({
  imports: [],
  providers: [TaskResolver, TaskService, UserService],
  exports: [TaskService],
})
export class TaskModule {}
