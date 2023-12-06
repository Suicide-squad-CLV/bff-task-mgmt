import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { UserService } from 'src/module/user/user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TASK_PACKAGE_NAME } from 'src/grpc/interface/task';
import { USER_PACKAGE_NAME } from 'src/grpc/interface/user';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TASK_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '',
          package: TASK_PACKAGE_NAME,
          protoPath: [join(__dirname, '../../grpc/proto/task.proto')],
        },
      },
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '',
          package: USER_PACKAGE_NAME,
          protoPath: [join(__dirname, '../../grpc/proto/user.proto')],
        },
      },
    ]),
  ],
  providers: [TaskResolver, TaskService, UserService],
  exports: [TaskService],
})
export class TaskModule {}
