import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc/grpc-client.options';
import { UserService } from './user.service';
import { TaskService } from 'src/task/task.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grpcClientOptions,
      },
      {
        name: 'TASK_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  providers: [UserResolver, UserService, TaskService],
  exports: [UserService],
})
export class UserModule {}
