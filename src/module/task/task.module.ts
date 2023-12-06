import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { UserService } from 'src/module/user/user.service';
import { ClientsModule } from '@nestjs/microservices';
import { TASK_PACKAGE_NAME } from 'src/grpc/interface/task';
import { USER_PACKAGE_NAME } from 'src/grpc/interface/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getGrpcOptions from 'src/grpc/grpc-client.options';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_PACKAGE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, USER_PACKAGE_NAME, 'user');
        },
      },
      {
        name: TASK_PACKAGE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, TASK_PACKAGE_NAME, 'task');
        },
      },
    ]),
  ],
  providers: [TaskResolver, TaskService, UserService],
  exports: [TaskService],
})
export class TaskModule {}
