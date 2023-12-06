import getGrpcOptions from './../../grpc/grpc-client.options';
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { ClientsModule } from '@nestjs/microservices';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_PACKAGE_NAME } from 'src/grpc/user';
import { TaskService } from '../task/task.service';
import { TASK_PACKAGE_NAME } from 'src/grpc/task';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, USER_PACKAGE_NAME, 'user');
        },
      },
      {
        name: 'TASK_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, TASK_PACKAGE_NAME, 'task');
        },
      },
    ]),
  ],
  providers: [UserResolver, UserService, TaskService],
  exports: [UserService],
})
export class UserModule {}
