import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc/grpc-client.options';
import { TaskService } from './task.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASK_PACKAGE',
        ...grpcClientOptions,
      },
      {
        name: 'USER_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  providers: [TaskResolver, TaskService, UserService],
  exports: [TaskService],
})
export class TaskModule {}
