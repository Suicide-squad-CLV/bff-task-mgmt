import { Module } from '@nestjs/common';
import { DateScalar } from 'src/graphql/scalar/date.scalar';
import { TaskResolver } from './task.resolver';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc/grpc-client.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASK_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  providers: [TaskResolver, DateScalar],
})
export class TaskModule {}
