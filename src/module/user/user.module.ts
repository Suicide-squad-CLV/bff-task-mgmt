import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TaskService } from 'src/module/task/task.service';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TASK_PACKAGE_NAME } from 'src/grpc/interface/task';
import { USER_PACKAGE_NAME } from 'src/grpc/interface/user';

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
  providers: [UserResolver, UserService, TaskService],
  exports: [UserService],
})
export class UserModule {}
