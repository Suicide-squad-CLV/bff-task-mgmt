import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TaskService } from '../task/task.service';
import { ClientsModule } from '@nestjs/microservices';
import { TASK_PACKAGE_NAME } from '../../grpc/interface/task';
import { USER_PACKAGE_NAME } from '../../grpc/interface/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getGrpcOptions from '../../grpc/grpc-client.options';

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
  providers: [UserResolver, UserService, TaskService],
  exports: [UserService],
})
export class UserModule {}
