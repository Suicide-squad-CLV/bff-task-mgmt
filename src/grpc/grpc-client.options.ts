import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '',
    package: ['user', 'task'],
    protoPath: [
      join(__dirname, './task.proto'),
      join(__dirname, './user.proto'),
    ],
  },
};
