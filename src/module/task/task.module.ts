import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { ClientsModule } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getGrpcOptions from 'src/grpc/grpc-client.options';
import { TASK_PACKAGE_NAME } from 'src/grpc/task';
import { UserService } from '../user/user.service';
import { USER_PACKAGE_NAME } from 'src/grpc/user';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TASK_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, TASK_PACKAGE_NAME, 'task');
        },
      },
      {
        name: 'USER_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, USER_PACKAGE_NAME, 'user');
        },
      },
    ]),
  ],
  providers: [TaskResolver, TaskService, UserService],
  exports: [TaskService],
})
export class TaskModule {}
